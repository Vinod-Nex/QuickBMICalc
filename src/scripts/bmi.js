"use strict";

document.addEventListener("DOMContentLoaded", () => {
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

	// Error elements
	const weightError = document.getElementById("weight-error");
	const heightError = document.getElementById("height-error");
	const imperialHeightError = document.getElementById("imperial-height-error");

	// Active unit state
	let currentUnit = "metric";

	// Initial configuration
	updateFormFields();

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
	bmiForm.addEventListener("submit", (e) => {
		e.preventDefault();
		
		clearValidationErrors();
		const isValid = validateInputs();

		if (isValid) {
			calculateAndDisplayBMI();
		}
	});

	// Update fields required properties and visibility based on unit
	function updateFormFields() {
		if (currentUnit === "metric") {
			// Show Metric UI
			heightMetricContainer.classList.remove("hidden");
			heightImperialContainer.classList.add("hidden");
			
			weightLabel.textContent = "Weight (kg)";
			weightInput.placeholder = "Weight (e.g., 70)";
			heightLabel.textContent = "Height (cm)";
			heightInput.placeholder = "Height (e.g., 175)";
			
			// Set correct required state
			weightInput.required = true;
			heightInput.required = true;
			heightFtInput.required = false;
			heightInInput.required = false;
		} else {
			// Show Imperial UI
			heightMetricContainer.classList.add("hidden");
			heightImperialContainer.classList.remove("hidden");
			
			weightLabel.textContent = "Weight (lb)";
			weightInput.placeholder = "Weight (e.g., 150)";
			
			// Set correct required state
			weightInput.required = true;
			heightInput.required = false;
			heightFtInput.required = true;
			heightInInput.required = true;
		}
	}

	// Helper to clear results
	function clearResult() {
		resultDiv.classList.add("hidden");
		bmiValueSpan.textContent = "--.-";
		bmiCategorySpan.textContent = "";
		bmiCategorySpan.className = "bmi-category"; // reset classes
		bmiMeterBar.style.left = "50%";
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

	// Core logic
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
		let category = "Normal";
		let categoryClass = "normal";

		if (roundedBMI < 18.5) {
			category = "Underweight";
			categoryClass = "underweight";
		} else if (roundedBMI >= 18.5 && roundedBMI <= 24.9) {
			category = "Healthy";
			categoryClass = "normal";
		} else if (roundedBMI >= 25 && roundedBMI <= 29.9) {
			category = "Overweight";
			categoryClass = "overweight";
		} else {
			category = "Obese";
			categoryClass = "obese";
		}

		// Update UI elements
		bmiValueSpan.textContent = roundedBMI.toFixed(1);
		bmiCategorySpan.textContent = category;
		
		// Reset & Apply Category Class
		bmiCategorySpan.className = `bmi-category ${categoryClass}`;

		// Meter Pointer: Scale 0-40 BMI to 0-100%, clamp
		let percentage = (roundedBMI / 40) * 100;
		percentage = Math.max(0, Math.min(100, percentage));
		bmiMeterBar.style.left = `${percentage}%`;

		// Reveal Results with CSS animation
		resultDiv.classList.remove("hidden");
	}
});
