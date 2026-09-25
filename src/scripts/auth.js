import {
	signIn,
	signUp,
	sendMagicLink,
	signOut,
	getCurrentUser,
	getBmiHistory,
	deleteBmiRecord,
	isSupabaseConfigured
} from '../lib/supabase.js';

document.addEventListener('DOMContentLoaded', async () => {
	// Header Auth Elements
	const authOpenBtn = document.getElementById('auth-open-btn');
	const userMenu = document.getElementById('user-menu');
	const userEmailSpan = document.getElementById('user-email-display');
	const userAvatarChar = document.getElementById('user-avatar-char');
	const userDropdown = document.getElementById('user-dropdown');
	const openHistoryBtn = document.getElementById('open-history-btn');
	const signOutBtn = document.getElementById('sign-out-btn');
	const loginHint = document.getElementById('login-hint');

	// Auth Modal Elements
	const authModal = document.getElementById('auth-modal');
	const authModalBackdrop = document.getElementById('auth-modal-backdrop');
	const authModalClose = document.getElementById('auth-modal-close');
	const authForm = document.getElementById('auth-form');
	const authEmail = document.getElementById('auth-email');
	const authPassword = document.getElementById('auth-password');
	const authPasswordGroup = document.getElementById('auth-password-group');
	const authMessage = document.getElementById('auth-message');
	const authSubmitBtn = document.getElementById('auth-submit-btn');
	const authSubmitText = document.getElementById('auth-submit-text');
	const authSubmitSpinner = document.getElementById('auth-submit-spinner');
	const authModalTitle = document.getElementById('auth-modal-title');
	const authNotice = document.getElementById('auth-notice');
	const authNoticeText = document.getElementById('auth-notice-text');

	// Tabs
	const tabSignIn = document.getElementById('tab-signin');
	const tabSignUp = document.getElementById('tab-signup');
	const tabMagic = document.getElementById('tab-magic');

	// History Modal Elements
	const historyModal = document.getElementById('history-modal');
	const historyModalBackdrop = document.getElementById('history-modal-backdrop');
	const historyModalClose = document.getElementById('history-modal-close');
	const historyCloseBtnBottom = document.getElementById('history-close-btn-bottom');
	const historyList = document.getElementById('history-list');
	const historyEmpty = document.getElementById('history-empty');
	const historyUserEmail = document.getElementById('history-user-email');
	const historyCount = document.getElementById('history-count');

	let currentAuthMode = 'signin'; // 'signin' | 'signup' | 'magic'
	let activeUser = null;

	// Check configuration status and update banner
	if (!isSupabaseConfigured && authNotice && authNoticeText) {
		authNoticeText.textContent = "Supabase API keys not configured in environment yet. Running in demo mode (you can test sign in and history tracking locally).";
	}

	// Initialize User State
	activeUser = await getCurrentUser();
	updateUserUI(activeUser);

	// Event Listeners for Auth Modal
	if (authOpenBtn) {
		authOpenBtn.addEventListener('click', () => openAuthModal('signin'));
	}

	const hintLoginBtn = document.getElementById('hint-login-btn');
	if (hintLoginBtn) {
		hintLoginBtn.addEventListener('click', () => openAuthModal('signin'));
	}

	if (authModalBackdrop) {
		authModalBackdrop.addEventListener('click', closeAuthModal);
	}

	if (authModalClose) {
		authModalClose.addEventListener('click', closeAuthModal);
	}

	// Close on Escape
	window.addEventListener('keydown', (e) => {
		if (e.key === 'Escape') {
			closeAuthModal();
			closeHistoryModal();
			closeUserDropdown();
		}
	});

	// Tab Switching
	if (tabSignIn) {
		tabSignIn.addEventListener('click', () => setAuthMode('signin'));
	}
	if (tabSignUp) {
		tabSignUp.addEventListener('click', () => setAuthMode('signup'));
	}
	if (tabMagic) {
		tabMagic.addEventListener('click', () => setAuthMode('magic'));
	}

	// Toggle User Dropdown
	if (userMenu) {
		const trigger = document.getElementById('user-menu-trigger');
		if (trigger) {
			trigger.addEventListener('click', (e) => {
				e.stopPropagation();
				userDropdown?.classList.toggle('hidden');
			});
		}
	}

	document.addEventListener('click', (e) => {
		if (userDropdown && !userDropdown.contains(e.target) && !userMenu?.contains(e.target)) {
			closeUserDropdown();
		}
	});

	function closeUserDropdown() {
		userDropdown?.classList.add('hidden');
	}

	// Sign Out Button
	if (signOutBtn) {
		signOutBtn.addEventListener('click', async () => {
			closeUserDropdown();
			await signOut();
			activeUser = null;
			updateUserUI(null);
		});
	}

	// History Modal Listeners
	if (openHistoryBtn) {
		openHistoryBtn.addEventListener('click', () => {
			closeUserDropdown();
			openHistoryModal();
		});
	}

	if (historyModalBackdrop) {
		historyModalBackdrop.addEventListener('click', closeHistoryModal);
	}

	if (historyModalClose) {
		historyModalClose.addEventListener('click', closeHistoryModal);
	}

	if (historyCloseBtnBottom) {
		historyCloseBtnBottom.addEventListener('click', closeHistoryModal);
	}

	// Auth Form Submission
	if (authForm) {
		authForm.addEventListener('submit', async (e) => {
			e.preventDefault();
			clearAuthMessage();

			const email = authEmail.value.trim();
			const password = authPassword?.value || '';

			if (!email || !email.includes('@')) {
				showAuthMessage('Please enter a valid email address.', 'error');
				authEmail.focus();
				return;
			}

			if (currentAuthMode !== 'magic' && (!password || password.length < 6)) {
				showAuthMessage('Password must be at least 6 characters long.', 'error');
				authPassword.focus();
				return;
			}

			setSubmitting(true);

			try {
				if (currentAuthMode === 'signin') {
					const { data, error } = await signIn(email, password);
					if (error) throw error;
					activeUser = data.user;
					updateUserUI(activeUser);
					showAuthMessage('Signed in successfully!', 'success');
					setTimeout(closeAuthModal, 600);
				} else if (currentAuthMode === 'signup') {
					const { data, error } = await signUp(email, password);
					if (error) throw error;
					activeUser = data.user;
					updateUserUI(activeUser);
					showAuthMessage('Account created successfully!', 'success');
					setTimeout(closeAuthModal, 600);
				} else if (currentAuthMode === 'magic') {
					const { error } = await sendMagicLink(email);
					if (error) throw error;
					showAuthMessage('Magic link sent! Check your inbox to sign in.', 'success');
				}
			} catch (err) {
				showAuthMessage(err.message || 'Authentication failed. Please try again.', 'error');
			} finally {
				setSubmitting(false);
			}
		});
	}

	// Listen for auth state change custom events
	window.addEventListener('auth:state-change', (e) => {
		activeUser = e.detail?.user || null;
		updateUserUI(activeUser);
	});

	// Listen for history updates
	window.addEventListener('bmi:history-updated', () => {
		if (!historyModal?.classList.contains('hidden')) {
			loadHistoryEntries();
		}
	});

	function setAuthMode(mode) {
		currentAuthMode = mode;
		clearAuthMessage();

		[tabSignIn, tabSignUp, tabMagic].forEach(tab => {
			tab?.classList.remove('active');
			tab?.setAttribute('aria-selected', 'false');
		});

		if (mode === 'signin') {
			tabSignIn?.classList.add('active');
			tabSignIn?.setAttribute('aria-selected', 'true');
			if (authModalTitle) authModalTitle.textContent = 'Sign In to Your Account';
			if (authSubmitText) authSubmitText.textContent = 'Sign In';
			authPasswordGroup?.classList.remove('hidden');
			if (authPassword) authPassword.required = true;
		} else if (mode === 'signup') {
			tabSignUp?.classList.add('active');
			tabSignUp?.setAttribute('aria-selected', 'true');
			if (authModalTitle) authModalTitle.textContent = 'Create Your Free Account';
			if (authSubmitText) authSubmitText.textContent = 'Create Account';
			authPasswordGroup?.classList.remove('hidden');
			if (authPassword) authPassword.required = true;
		} else if (mode === 'magic') {
			tabMagic?.classList.add('active');
			tabMagic?.setAttribute('aria-selected', 'true');
			if (authModalTitle) authModalTitle.textContent = 'Sign In with Magic Link';
			if (authSubmitText) authSubmitText.textContent = 'Send Magic Link';
			authPasswordGroup?.classList.add('hidden');
			if (authPassword) authPassword.required = false;
		}
	}

	function openAuthModal(mode = 'signin') {
		setAuthMode(mode);
		authModal?.classList.remove('hidden');
		authModal?.setAttribute('aria-hidden', 'false');
		authEmail?.focus();
	}

	function closeAuthModal() {
		authModal?.classList.add('hidden');
		authModal?.setAttribute('aria-hidden', 'true');
		clearAuthMessage();
	}

	async function openHistoryModal() {
		historyModal?.classList.remove('hidden');
		historyModal?.setAttribute('aria-hidden', 'false');
		if (historyUserEmail) {
			historyUserEmail.textContent = activeUser?.email || 'Anonymous / Guest';
		}
		await loadHistoryEntries();
	}

	function closeHistoryModal() {
		historyModal?.classList.add('hidden');
		historyModal?.setAttribute('aria-hidden', 'true');
	}

	async function loadHistoryEntries() {
		const items = await getBmiHistory();
		if (historyCount) {
			historyCount.textContent = `${items.length} ${items.length === 1 ? 'entry' : 'entries'}`;
		}

		if (!historyList) return;

		// Clear previous items except empty notice
		const existingItems = historyList.querySelectorAll('.history-item');
		existingItems.forEach(el => el.remove());

		if (items.length === 0) {
			historyEmpty?.classList.remove('hidden');
			return;
		}

		historyEmpty?.classList.add('hidden');

		items.forEach(item => {
			const itemEl = document.createElement('div');
			itemEl.className = 'history-item';
			const dateStr = item.created_at ? new Date(item.created_at).toLocaleDateString(undefined, {
				month: 'short',
				day: 'numeric',
				hour: '2-digit',
				minute: '2-digit'
			}) : 'Recent';

			const categoryKey = (item.category || 'normal').toLowerCase().replace(/\s+/g, '-');
			const categoryClass = categoryKey.includes('under') ? 'underweight'
				: categoryKey.includes('over') ? 'overweight'
				: categoryKey.includes('obese') ? 'obese' : 'normal';

			itemEl.innerHTML = `
				<div class="history-item-left">
					<span class="history-item-date">${dateStr}</span>
					<span class="history-item-details">
						${item.weight} ${item.unit === 'imperial' ? 'lb' : 'kg'} &bull; ${item.height} ${item.unit === 'imperial' ? 'in' : 'cm'}
					</span>
				</div>
				<div class="history-item-right">
					<span class="history-bmi-badge ${categoryClass}">${item.bmi}</span>
					<button type="button" class="history-delete-btn" aria-label="Delete entry" data-id="${item.id}">
						<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
							<polyline points="3 6 5 6 21 6"></polyline>
							<path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
						</svg>
					</button>
				</div>
			`;

			const deleteBtn = itemEl.querySelector('.history-delete-btn');
			deleteBtn?.addEventListener('click', async () => {
				await deleteBmiRecord(item.id);
				itemEl.remove();
				loadHistoryEntries();
			});

			historyList.appendChild(itemEl);
		});
	}

	function updateUserUI(user) {
		if (user) {
			authOpenBtn?.classList.add('hidden');
			userMenu?.classList.remove('hidden');
			if (userEmailSpan) userEmailSpan.textContent = user.email || 'User';
			if (userAvatarChar) userAvatarChar.textContent = (user.email ? user.email[0].toUpperCase() : 'U');
			if (loginHint) loginHint.classList.add('hidden');
		} else {
			authOpenBtn?.classList.remove('hidden');
			userMenu?.classList.add('hidden');
			if (loginHint) loginHint.classList.remove('hidden');
		}
	}

	function setSubmitting(isSubmitting) {
		if (authSubmitBtn) authSubmitBtn.disabled = isSubmitting;
		if (authSubmitSpinner) authSubmitSpinner.classList.toggle('hidden', !isSubmitting);
		if (authSubmitText) authSubmitText.classList.toggle('hidden', isSubmitting);
	}

	function showAuthMessage(msg, type = 'error') {
		if (!authMessage) return;
		authMessage.textContent = msg;
		authMessage.className = `auth-message ${type}`;
		authMessage.classList.remove('hidden');
	}

	function clearAuthMessage() {
		if (!authMessage) return;
		authMessage.textContent = '';
		authMessage.className = 'auth-message hidden';
	}
});
