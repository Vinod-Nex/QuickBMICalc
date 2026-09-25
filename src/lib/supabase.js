import { createClient } from '@supabase/supabase-js';

// Environment variables from Astro (prefixed with PUBLIC_ for client exposure)
const envUrl = typeof import.meta !== 'undefined' && import.meta.env ? import.meta.env.PUBLIC_SUPABASE_URL : '';
const envKey = typeof import.meta !== 'undefined' && import.meta.env ? import.meta.env.PUBLIC_SUPABASE_ANON_KEY : '';

// Also check window or localStorage for dynamic runtime configuration
const runtimeUrl = typeof window !== 'undefined' ? (window.__SUPABASE_URL__ || localStorage.getItem('supabase_url') || '') : '';
const runtimeKey = typeof window !== 'undefined' ? (window.__SUPABASE_ANON_KEY__ || localStorage.getItem('supabase_anon_key') || '') : '';

export const SUPABASE_URL = (envUrl && !envUrl.includes('your-supabase-url')) ? envUrl : runtimeUrl;
export const SUPABASE_ANON_KEY = (envKey && !envKey.includes('your-anon-key')) ? envKey : runtimeKey;

export const isSupabaseConfigured = Boolean(
	SUPABASE_URL && 
	SUPABASE_ANON_KEY && 
	SUPABASE_URL.startsWith('http')
);

// Initialize Supabase client if credentials are valid
export const supabase = isSupabaseConfigured
	? createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
			auth: {
				persistSession: true,
				autoRefreshToken: true,
				detectSessionInUrl: true
			}
	  })
	: null;

/**
 * Sign In with Email and Password
 */
export async function signIn(email, password) {
	if (!isSupabaseConfigured || !supabase) {
		// Local fallback mode for demo/testing before API keys are provided
		const demoUser = { id: 'demo-user', email, isDemo: true };
		localStorage.setItem('quickbmi_demo_user', JSON.stringify(demoUser));
		window.dispatchEvent(new CustomEvent('auth:state-change', { detail: { user: demoUser } }));
		return { data: { user: demoUser }, error: null };
	}

	const { data, error } = await supabase.auth.signInWithPassword({
		email,
		password
	});

	if (!error && data.user) {
		window.dispatchEvent(new CustomEvent('auth:state-change', { detail: { user: data.user } }));
	}

	return { data, error };
}

/**
 * Sign Up with Email and Password
 */
export async function signUp(email, password) {
	if (!isSupabaseConfigured || !supabase) {
		const demoUser = { id: 'demo-user', email, isDemo: true };
		localStorage.setItem('quickbmi_demo_user', JSON.stringify(demoUser));
		window.dispatchEvent(new CustomEvent('auth:state-change', { detail: { user: demoUser } }));
		return { data: { user: demoUser }, error: null };
	}

	const { data, error } = await supabase.auth.signUp({
		email,
		password
	});

	return { data, error };
}

/**
 * Sign In with Magic Link (Email OTP)
 */
export async function sendMagicLink(email) {
	if (!isSupabaseConfigured || !supabase) {
		return { data: null, error: { message: "Supabase API keys are required for Magic Link authentication." } };
	}

	const { data, error } = await supabase.auth.signInWithOtp({
		email,
		options: {
			emailRedirectTo: typeof window !== 'undefined' ? window.location.origin : undefined
		}
	});

	return { data, error };
}

/**
 * Sign Out
 */
export async function signOut() {
	if (typeof window !== 'undefined') {
		localStorage.removeItem('quickbmi_demo_user');
	}

	if (isSupabaseConfigured && supabase) {
		await supabase.auth.signOut();
	}

	if (typeof window !== 'undefined') {
		window.dispatchEvent(new CustomEvent('auth:state-change', { detail: { user: null } }));
	}
}

/**
 * Get current session and user
 */
export async function getCurrentUser() {
	if (typeof window !== 'undefined') {
		const demoUserStr = localStorage.getItem('quickbmi_demo_user');
		if (demoUserStr) {
			try {
				return JSON.parse(demoUserStr);
			} catch (_) {}
		}
	}

	if (!isSupabaseConfigured || !supabase) {
		return null;
	}

	try {
		const { data: { session } } = await supabase.auth.getSession();
		return session?.user || null;
	} catch (e) {
		console.warn('Error fetching Supabase session:', e);
		return null;
	}
}

/**
 * Save BMI Calculation Record (Supabase Table + LocalStorage cache)
 */
export async function saveBmiRecord(record) {
	const user = await getCurrentUser();
	const entry = {
		id: 'bmi_' + Date.now(),
		user_id: user?.id || 'anonymous',
		bmi: record.bmi,
		category: record.category,
		weight: record.weight,
		height: record.height,
		unit: record.unit,
		created_at: new Date().toISOString()
	};

	// Save to localStorage history
	if (typeof window !== 'undefined') {
		const history = getLocalHistory();
		history.unshift(entry);
		// Keep last 50 entries
		localStorage.setItem('quickbmi_history', JSON.stringify(history.slice(0, 50)));
		window.dispatchEvent(new CustomEvent('bmi:history-updated'));
	}

	// If logged in with real Supabase, sync to `bmi_history` table
	if (isSupabaseConfigured && supabase && user && !user.isDemo) {
		try {
			await supabase.from('bmi_history').insert([{
				user_id: user.id,
				bmi: record.bmi,
				category: record.category,
				weight: record.weight,
				height: record.height,
				unit: record.unit
			}]);
		} catch (err) {
			console.warn('Could not save to Supabase table (ensure bmi_history table exists):', err);
		}
	}

	return entry;
}

/**
 * Get Local or Supabase BMI History
 */
export async function getBmiHistory() {
	const user = await getCurrentUser();
	let localList = getLocalHistory();

	if (isSupabaseConfigured && supabase && user && !user.isDemo) {
		try {
			const { data, error } = await supabase
				.from('bmi_history')
				.select('*')
				.eq('user_id', user.id)
				.order('created_at', { ascending: false })
				.limit(30);

			if (!error && data && data.length > 0) {
				return data;
			}
		} catch (err) {
			console.warn('Could not fetch from Supabase:', err);
		}
	}

	return localList;
}

/**
 * Delete a BMI Record
 */
export async function deleteBmiRecord(id) {
	if (typeof window !== 'undefined') {
		let history = getLocalHistory().filter(item => item.id !== id);
		localStorage.setItem('quickbmi_history', JSON.stringify(history));
		window.dispatchEvent(new CustomEvent('bmi:history-updated'));
	}

	const user = await getCurrentUser();
	if (isSupabaseConfigured && supabase && user && !user.isDemo) {
		try {
			await supabase.from('bmi_history').delete().eq('id', id);
		} catch (err) {
			console.warn('Could not delete from Supabase:', err);
		}
	}
}

function getLocalHistory() {
	if (typeof window === 'undefined') return [];
	try {
		const raw = localStorage.getItem('quickbmi_history');
		return raw ? JSON.parse(raw) : [];
	} catch (_) {
		return [];
	}
}
