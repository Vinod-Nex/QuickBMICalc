"use strict";
import { saveBmiRecord } from "../lib/supabase.js";

const I18N = {
	en: {
		weightMetricLabel: "Weight (kg)",
		weightMetricPlaceholder: "Weight (e.g., 70)",
		heightMetricLabel: "Height (cm)",
		heightMetricPlaceholder: "Height (e.g., 175)",
		weightImperialLabel: "Weight (lb)",
		weightImperialPlaceholder: "Weight (e.g., 150)",
		feetPlaceholder: "Feet",
		inchesPlaceholder: "Inches",
		categories: {
			underweight: "Underweight",
			normal: "Healthy Weight",
			overweight: "Overweight",
			obese: "Obese"
		}
	},
	pt: {
		weightMetricLabel: "Peso (kg)",
		weightMetricPlaceholder: "Peso (ex: 70)",
		heightMetricLabel: "Altura (cm)",
		heightMetricPlaceholder: "Altura (ex: 175)",
		weightImperialLabel: "Peso (lb)",
		weightImperialPlaceholder: "Peso (ex: 150)",
		feetPlaceholder: "Pés",
		inchesPlaceholder: "Polegadas",
		categories: {
			underweight: "Abaixo do peso",
			normal: "Peso Saudável",
			overweight: "Sobrepeso",
			obese: "Obesidade"
		}
	},
	de: {
		weightMetricLabel: "Gewicht (kg)",
		weightMetricPlaceholder: "Gewicht (z. B. 70)",
		heightMetricLabel: "Größe (cm)",
		heightMetricPlaceholder: "Größe (z. B. 175)",
		weightImperialLabel: "Gewicht (lb)",
		weightImperialPlaceholder: "Gewicht (z. B. 150)",
		feetPlaceholder: "Fuß",
		inchesPlaceholder: "Zoll",
		categories: {
			underweight: "Untergewicht",
			normal: "Normalgewicht",
			overweight: "Übergewicht",
			obese: "Adipositas"
		}
	}
};

document.addEventListener("DOMContentLoaded", () => {
	// Detect Active Language
	const currentLang = (document.documentElement.lang && I18N[document.documentElement.lang])
		? document.documentElement.lang
		: "en";
	const strings = I18N[currentLang];

	// DOM Elements
	const bmiForm = document.getElementById("bmi-form");
	const unitRadios = document.querySelectorAll('input[name="unit-system"]');
	
	const weightInput = document.getElementById("weight");
	const heightInput = document.getElementById("height");
	const heightFtInput = document.getElementById("height-ft");
	const heightInInput = document.getElementById("height-in");
	
	const weightLabel = document.getElementById("weight-label");
	const heightLabel = document.getElementById("height-label");
	
	const heightMetricContainer = document.getElementById("height-metric-container");
	const heightImperialContainer = document.getElementById("height-imperial-container");
	
	const resultDiv = document.getElementById("result");
	const bmiValueSpan = document.getElementById("bmi-value");
	const bmiCategorySpan = document.getElementById("bmi-category");
	const bmiMeterBar = document.getElementById("bmi-meter-bar");

	// Table Rows
	const tableRows = {
		underweight: document.getElementById("row-underweight"),
		normal: document.getElementById("row-normal"),
		overweight: document.getElementById("row-overweight"),
		obese: document.getElementById("row-obese")
	};

	// Theme Toggle
	const themeToggleBtn = document.getElementById("theme-toggle");

	// Active unit state
	let currentUnit = "metric";

	// Initial configuration
	updateFormFields();
	initThemeToggle();

	// Listen for unit system toggling
	unitRadios.forEach(radio => {
		radio.addEventListener("change", (e) => {
			currentUnit = e.target.value;
			updateFormFields();
			clearResult();
			clearValidationErrors();
		});
	});

	// Handle form submission
	if (bmiForm) {
		bmiForm.addEventListener("submit", (e) => {
			e.preventDefault();
			
			clearValidationErrors();
			const isValid = validateInputs();

			if (isValid) {
				calculateAndDisplayBMI();
			}
		});
	}

	// Theme toggler initializer
	function initThemeToggle() {
		if (!themeToggleBtn) return;
		
		themeToggleBtn.addEventListener("click", () => {
			const isDark = document.documentElement.classList.toggle("dark");
			localStorage.setItem("theme", isDark ? "dark" : "light");
		});
	}

	// Update fields required properties and visibility based on unit and language
	function updateFormFields() {
		if (!weightLabel || !weightInput) return;

		if (currentUnit === "metric") {
			// Show Metric UI
			if (heightMetricContainer) heightMetricContainer.classList.remove("hidden");
			if (heightImperialContainer) heightImperialContainer.classList.add("hidden");
			
			weightLabel.textContent = strings.weightMetricLabel;
			weightInput.placeholder = strings.weightMetricPlaceholder;
			if (heightLabel) heightLabel.textContent = strings.heightMetricLabel;
			if (heightInput) heightInput.placeholder = strings.heightMetricPlaceholder;
			
			// Set correct required state
			weightInput.required = true;
			if (heightInput) heightInput.required = true;
			if (heightFtInput) heightFtInput.required = false;
			if (heightInInput) heightInInput.required = false;
		} else {
			// Show Imperial UI
			if (heightMetricContainer) heightMetricContainer.classList.add("hidden");
			if (heightImperialContainer) heightImperialContainer.classList.remove("hidden");
			
			weightLabel.textContent = strings.weightImperialLabel;
			weightInput.placeholder = strings.weightImperialPlaceholder;
			if (heightFtInput) heightFtInput.placeholder = strings.feetPlaceholder;
			if (heightInInput) heightInInput.placeholder = strings.inchesPlaceholder;
			
			// Set correct required state
			weightInput.required = true;
			if (heightInput) heightInput.required = false;
			if (heightFtInput) heightFtInput.required = true;
			if (heightInInput) heightInInput.required = true;
		}
	}

	// Helper to clear results
	function clearResult() {
		if (!resultDiv) return;
		resultDiv.classList.add("hidden");
		if (bmiValueSpan) bmiValueSpan.textContent = "--.-";
		if (bmiCategorySpan) {
			bmiCategorySpan.textContent = "";
			bmiCategorySpan.className = "bmi-category";
		}
		if (bmiMeterBar) bmiMeterBar.style.left = "50%";
		
		// Reset table highlighting
		Object.values(tableRows).forEach(row => {
			if (row) {
				row.className = "";
			}
		});
	}

	// Helper to remove validation visual errors
	function clearValidationErrors() {
		document.querySelectorAll(".input-group").forEach(group => {
			group.classList.remove("invalid");
		});
	}

	// Validation logic
	function validateInputs() {
		let isValid = true;

		// 1. Weight Validation
		const weightVal = parseFloat(weightInput.value);
		if (isNaN(weightVal) || weightVal <= 0) {
			weightInput.closest(".input-group").classList.add("invalid");
			isValid = false;
		}

		// 2. Height Validation
		if (currentUnit === "metric") {
			const heightVal = parseFloat(heightInput.value);
			if (isNaN(heightVal) || heightVal <= 0) {
				heightInput.closest(".input-group").classList.add("invalid");
				isValid = false;
			}
		} else {
			const ftVal = parseFloat(heightFtInput.value);
			const inVal = parseFloat(heightInInput.value);
			
			const ftInvalid = isNaN(ftVal) || ftVal < 0;
			const inInvalid = isNaN(inVal) || inVal < 0 || inVal >= 12;
			
			// Must have positive total height
			if (ftInvalid || inInvalid || (ftVal === 0 && inVal === 0)) {
				heightImperialContainer.classList.add("invalid");
				isValid = false;
			}
		}

		return isValid;
	}

	// Highlight row inside standard category reference table
	function highlightTableRow(categoryClass) {
		// Reset classes on all table rows
		Object.values(tableRows).forEach(row => {
			if (row) {
				row.className = "";
			}
		});

		// Highlight target category row
		const targetRow = tableRows[categoryClass];
		if (targetRow) {
			targetRow.className = `active ${categoryClass}`;
		}
	}

	// Core calculation logic
	function calculateAndDisplayBMI() {
		let bmi = 0;
		const weightVal = parseFloat(weightInput.value);

		if (currentUnit === "metric") {
			const heightCm = parseFloat(heightInput.value);
			const heightM = heightCm / 100;
			bmi = weightVal / (heightM * heightM);
		} else {
			const ft = parseFloat(heightFtInput.value) || 0;
			const inches = parseFloat(heightInInput.value) || 0;
			const totalInches = (ft * 12) + inches;
			bmi = (weightVal / (totalInches * totalInches)) * 703;
		}

		// Round to one decimal
		const roundedBMI = Math.round(bmi * 10) / 10;

		// Determine Category
		let category = strings.categories.normal;
		let categoryClass = "normal";

		if (roundedBMI < 18.5) {
			category = strings.categories.underweight;
			categoryClass = "underweight";
		} else if (roundedBMI >= 18.5 && roundedBMI <= 24.9) {
			category = strings.categories.normal;
			categoryClass = "normal";
		} else if (roundedBMI >= 25 && roundedBMI <= 29.9) {
			category = strings.categories.overweight;
			categoryClass = "overweight";
		} else {
			category = strings.categories.obese;
			categoryClass = "obese";
		}

		// Update UI elements
		if (bmiValueSpan) bmiValueSpan.textContent = roundedBMI.toFixed(1);
		if (bmiCategorySpan) {
			bmiCategorySpan.textContent = category;
			bmiCategorySpan.className = `bmi-category ${categoryClass}`;
		}

		// Highlight matching table row
		highlightTableRow(categoryClass);

		// Meter Pointer: Scale 0-40 BMI to 0-100%, clamp
		let percentage = (roundedBMI / 40) * 100;
		percentage = Math.max(0, Math.min(100, percentage));
		if (bmiMeterBar) bmiMeterBar.style.left = `${percentage}%`;

		// Reveal Results with CSS animation
		if (resultDiv) resultDiv.classList.remove("hidden");

		// Automatically save calculation to history (Supabase if logged in, local cache)
		const heightDisplay = currentUnit === "metric" 
			? parseFloat(heightInput.value)
			: `${parseFloat(heightFtInput.value) || 0}ft ${parseFloat(heightInInput.value) || 0}in`;
		
		saveBmiRecord({
			bmi: roundedBMI.toFixed(1),
			category: category,
			weight: weightVal,
			height: heightDisplay,
			unit: currentUnit
		}).then(() => {
			const savedBadge = document.getElementById("saved-history-badge");
			if (savedBadge) {
				savedBadge.classList.remove("hidden");
				setTimeout(() => savedBadge.classList.add("hidden"), 3000);
			}
		}).catch((err) => {
			console.warn("Could not save BMI record:", err);
		});

		// Smooth scroll to result details on small mobile layouts
		if (window.innerWidth < 992 && resultDiv) {
			setTimeout(() => {
				resultDiv.scrollIntoView({ behavior: "smooth", block: "nearest" });
			}, 100);
		}
	}
});
