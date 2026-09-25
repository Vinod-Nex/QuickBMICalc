export interface Translation {
	locale: 'en' | 'pt' | 'de';
	langName: string;
	title: string;
	description: string;
	keywords: string;
	h1: string;
	cardDescription: string;
	metricLabel: string;
	imperialLabel: string;
	weightKgLabel: string;
	weightLbLabel: string;
	weightPlaceholderMetric: string;
	weightPlaceholderImperial: string;
	heightCmLabel: string;
	heightPlaceholderMetric: string;
	heightImperialLabel: string;
	feetPlaceholder: string;
	inchesPlaceholder: string;
	weightError: string;
	heightError: string;
	imperialHeightError: string;
	calculateBtn: string;
	yourBmi: string;
	categories: {
		underweight: string;
		normal: string;
		overweight: string;
		obese: string;
	};
	disclaimer: string;
	chartTitle: string;
	chartDescription: string;
	chartThCategory: string;
	chartThRange: string;
	tipsTitle: string;
	tips: Array<{
		title: string;
		text: string;
	}>;
	privacyTitle: string;
	privacyText: string;
	langSelectLabel: string;
	signIn: string;
	signUp: string;
	signOut: string;
	email: string;
	password: string;
	myAccount: string;
	myHistory: string;
	loginToSave: string;
	authModalTitleSignIn: string;
	authModalTitleSignUp: string;
	magicLinkOption: string;
	sendMagicLink: string;
	historyModalTitle: string;
	noHistoryText: string;
	savedBadge: string;
	deleteRecord: string;
}

export const translations: Record<'en' | 'pt' | 'de', Translation> = {
	en: {
		locale: 'en',
		langName: 'English',
		title: 'BMI Calculator – QuickBMICalc.com',
		description: 'Free online BMI calculator. Check your body mass index instantly with metric or imperial units. Privacy-focused, no ads, no tracking.',
		keywords: 'BMI calculator, body mass index, BMI check, healthy weight, BMI chart, QuickBMICalc',
		h1: 'BMI Calculator',
		cardDescription: 'Enter your weight and height to calculate your Body Mass Index (BMI).',
		metricLabel: 'Metric (kg/cm)',
		imperialLabel: 'Imperial (lb/in)',
		weightKgLabel: 'Weight (kg)',
		weightLbLabel: 'Weight (lb)',
		weightPlaceholderMetric: 'Weight (e.g., 70)',
		weightPlaceholderImperial: 'Weight (e.g., 150)',
		heightCmLabel: 'Height (cm)',
		heightPlaceholderMetric: 'Height (e.g., 175)',
		heightImperialLabel: 'Height',
		feetPlaceholder: 'Feet',
		inchesPlaceholder: 'Inches',
		weightError: 'Please enter a valid weight (greater than 0).',
		heightError: 'Please enter a valid height (greater than 0).',
		imperialHeightError: 'Please enter a valid height (greater than 0).',
		calculateBtn: 'Calculate BMI',
		yourBmi: 'Your BMI',
		categories: {
			underweight: 'Underweight',
			normal: 'Healthy Weight',
			overweight: 'Overweight',
			obese: 'Obese',
		},
		disclaimer: 'BMI is a screening measure and not a diagnostic tool. Consult a healthcare provider.',
		chartTitle: 'BMI Categories Chart',
		chartDescription: 'World Health Organization (WHO) standard categories for adult body weight classifications:',
		chartThCategory: 'Category',
		chartThRange: 'BMI Range',
		tipsTitle: 'Healthy Weight Tips',
		tips: [
			{
				title: 'Balanced Diet:',
				text: 'Prioritize whole foods, fiber-rich vegetables, lean proteins, and complex carbohydrates.',
			},
			{
				title: 'Regular Movement:',
				text: 'Aim for 150 minutes of moderate activity or aerobic exercise weekly.',
			},
			{
				title: 'Adequate Hydration:',
				text: 'Drink plenty of water throughout the day; restrict sugary soda drinks.',
			},
			{
				title: 'Sleep Health:',
				text: 'Focus on getting 7-9 hours of restful sleep to optimize metabolism hormones.',
			},
		],
		privacyTitle: '100% Privacy‑First',
		privacyText: 'All calculation math happens strictly inside your local browser sandbox. We do not transmit, analyze, or upload your parameters to any cloud servers. Free of ads and tracking.',
		langSelectLabel: 'Select language',
		signIn: 'Sign In',
		signUp: 'Create Account',
		signOut: 'Sign Out',
		email: 'Email',
		password: 'Password',
		myAccount: 'My Account',
		myHistory: 'BMI History',
		loginToSave: 'Sign in to save and track your BMI history.',
		authModalTitleSignIn: 'Sign In to Your Account',
		authModalTitleSignUp: 'Create Your Free Account',
		magicLinkOption: 'Send Magic Link via Email',
		sendMagicLink: 'Send Magic Link',
		historyModalTitle: 'My BMI Calculation History',
		noHistoryText: 'No BMI records saved yet. Calculate your BMI to track your progress!',
		savedBadge: 'Saved to history',
		deleteRecord: 'Delete'
	},
	pt: {
		locale: 'pt',
		langName: 'Português',
		title: 'Calculadora de IMC – QuickBMICalc.com',
		description: 'Calculadora de IMC online gratuita. Calcule seu índice de massa corporal instantaneamente com unidades métricas ou imperiais. Focada em privacidade, sem anúncios, sem rastreamento.',
		keywords: 'calculadora de IMC, índice de massa corporal, calcular IMC, peso saudável, tabela de IMC, QuickBMICalc',
		h1: 'Calculadora de IMC',
		cardDescription: 'Insira seu peso e altura para calcular seu Índice de Massa Corporal (IMC).',
		metricLabel: 'Métrico (kg/cm)',
		imperialLabel: 'Imperial (lb/in)',
		weightKgLabel: 'Peso (kg)',
		weightLbLabel: 'Peso (lb)',
		weightPlaceholderMetric: 'Peso (ex: 70)',
		weightPlaceholderImperial: 'Peso (ex: 150)',
		heightCmLabel: 'Altura (cm)',
		heightPlaceholderMetric: 'Altura (ex: 175)',
		heightImperialLabel: 'Altura',
		feetPlaceholder: 'Pés',
		inchesPlaceholder: 'Polegadas',
		weightError: 'Por favor, insira um peso válido (maior que 0).',
		heightError: 'Por favor, insira uma altura válida (maior que 0).',
		imperialHeightError: 'Por favor, insira uma altura válida (maior que 0).',
		calculateBtn: 'Calcular IMC',
		yourBmi: 'Seu IMC',
		categories: {
			underweight: 'Abaixo do peso',
			normal: 'Peso Saudável',
			overweight: 'Sobrepeso',
			obese: 'Obesidade',
		},
		disclaimer: 'O IMC é uma medida de triagem e não uma ferramenta diagnóstica. Consulte um profissional de saúde.',
		chartTitle: 'Tabela de Categorias do IMC',
		chartDescription: 'Categorias padrão da Organização Mundial da Saúde (OMS) para classificação do peso corporal em adultos:',
		chartThCategory: 'Categoria',
		chartThRange: 'Faixa de IMC',
		tipsTitle: 'Dicas para um Peso Saudável',
		tips: [
			{
				title: 'Alimentação Equilibrada:',
				text: 'Priorize alimentos integrais, vegetais ricos em fibras, proteínas magras e carboidratos complexos.',
			},
			{
				title: 'Atividade Regular:',
				text: 'Procure realizar 150 minutos semanais de atividade física moderada ou exercícios aeróbicos.',
			},
			{
				title: 'Hidratação Adequada:',
				text: 'Beba bastante água ao longo do dia e restrinja refrigerantes e bebidas açucaradas.',
			},
			{
				title: 'Qualidade do Sono:',
				text: 'Durma entre 7 e 9 horas por noite para equilibrar o metabolismo e os hormônios.',
			},
		],
		privacyTitle: '100% Focado em Privacidade',
		privacyText: 'Todos os cálculos acontecem exclusivamente no navegador do seu dispositivo. Não transmitimos nem armazenamos seus dados em servidores. Livre de anúncios e rastreamento.',
		langSelectLabel: 'Selecionar idioma',
		signIn: 'Entrar',
		signUp: 'Criar Conta',
		signOut: 'Sair',
		email: 'E-mail',
		password: 'Senha',
		myAccount: 'Minha Conta',
		myHistory: 'Histórico de IMC',
		loginToSave: 'Entre para salvar e acompanhar seu histórico de IMC.',
		authModalTitleSignIn: 'Acessar sua Conta',
		authModalTitleSignUp: 'Criar Conta Gratuita',
		magicLinkOption: 'Enviar Link Mágico por E-mail',
		sendMagicLink: 'Enviar Link Mágico',
		historyModalTitle: 'Meu Histórico de Cálculos de IMC',
		noHistoryText: 'Nenhum registro salvo ainda. Calcule seu IMC para acompanhar seu progresso!',
		savedBadge: 'Salvo no histórico',
		deleteRecord: 'Excluir'
	},
	de: {
		locale: 'de',
		langName: 'Deutsch',
		title: 'BMI-Rechner – QuickBMICalc.com',
		description: 'Kostenloser Online-BMI-Rechner. Berechnen Sie Ihren Body-Mass-Index sofort mit metrischen oder imperialen Einheiten. Datenschutzfreundlich, werbefrei, ohne Tracking.',
		keywords: 'BMI Rechner, Body Mass Index, BMI berechnen, Idealgewicht, BMI Tabelle, QuickBMICalc',
		h1: 'BMI-Rechner',
		cardDescription: 'Geben Sie Ihr Gewicht und Ihre Körpergröße ein, um Ihren Body-Mass-Index (BMI) zu berechnen.',
		metricLabel: 'Metrisch (kg/cm)',
		imperialLabel: 'Imperial (lb/in)',
		weightKgLabel: 'Gewicht (kg)',
		weightLbLabel: 'Gewicht (lb)',
		weightPlaceholderMetric: 'Gewicht (z. B. 70)',
		weightPlaceholderImperial: 'Gewicht (z. B. 150)',
		heightCmLabel: 'Größe (cm)',
		heightPlaceholderMetric: 'Größe (z. B. 175)',
		heightImperialLabel: 'Größe',
		feetPlaceholder: 'Fuß',
		inchesPlaceholder: 'Zoll',
		weightError: 'Bitte geben Sie ein gültiges Gewicht ein (größer als 0).',
		heightError: 'Bitte geben Sie eine gültige Größe ein (größer als 0).',
		imperialHeightError: 'Bitte geben Sie eine gültige Größe ein (größer als 0).',
		calculateBtn: 'BMI berechnen',
		yourBmi: 'Ihr BMI',
		categories: {
			underweight: 'Untergewicht',
			normal: 'Normalgewicht',
			overweight: 'Übergewicht',
			obese: 'Adipositas',
		},
		disclaimer: 'Der BMI ist ein Orientierungswert und kein Diagnosewerkzeug. Wenden Sie sich bei Gesundheitsfragen an einen Arzt.',
		chartTitle: 'BMI-Kategorien-Tabelle',
		chartDescription: 'Standardkategorien der Weltgesundheitsorganisation (WHO) zur Einstufung des Körpergewichts Erwachsener:',
		chartThCategory: 'Kategorie',
		chartThRange: 'BMI-Bereich',
		tipsTitle: 'Tipps für ein gesundes Gewicht',
		tips: [
			{
				title: 'Ausgewogene Ernährung:',
				text: 'Bevorzugen Sie naturbelassene Lebensmittel, ballaststoffreiches Gemüse, mageres Protein und komplexe Kohlenhydrate.',
			},
			{
				title: 'Regelmäßige Bewegung:',
				text: 'Streben Sie mindestens 150 Minuten moderate körperliche Aktivität oder Ausdauertraining pro Woche an.',
			},
			{
				title: 'Ausreichend trinken:',
				text: 'Trinken Sie über den Tag verteilt reichlich Wasser und vermeiden Sie zuckerhaltige Softdrinks.',
			},
			{
				title: 'Erholsamer Schlaf:',
				text: 'Achten Sie auf 7 bis 9 Stunden Schlaf pro Nacht, um den Hormonhaushalt und Stoffwechsel zu optimieren.',
			},
		],
		privacyTitle: '100 % Datenschutz',
		privacyText: 'Alle Berechnungen laufen ausschließlich lokal in Ihrer Browser-Sandbox. Es werden keinerlei Parameter an externe Server übertragen oder gespeichert. Werbefrei und ohne Tracker.',
		langSelectLabel: 'Sprache auswählen',
		signIn: 'Anmelden',
		signUp: 'Konto erstellen',
		signOut: 'Abmelden',
		email: 'E-Mail',
		password: 'Passwort',
		myAccount: 'Mein Konto',
		myHistory: 'BMI-Verlauf',
		loginToSave: 'Melden Sie sich an, um Ihren BMI-Verlauf zu speichern und zu verfolgen.',
		authModalTitleSignIn: 'Bei Ihrem Konto anmelden',
		authModalTitleSignUp: 'Kostenloses Konto erstellen',
		magicLinkOption: 'Magic Link per E-Mail senden',
		sendMagicLink: 'Magic Link senden',
		historyModalTitle: 'Mein BMI-Berechnungsverlauf',
		noHistoryText: 'Noch keine Datensätze gespeichert. Berechnen Sie Ihren BMI, um Ihren Fortschritt zu verfolgen!',
		savedBadge: 'Im Verlauf gespeichert',
		deleteRecord: 'Löschen'
	},
};
