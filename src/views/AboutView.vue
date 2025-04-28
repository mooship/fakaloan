<script setup lang="ts">
import { useTitle } from '@vueuse/core';

// Setup
useTitle('About | Fakaloan');
</script>

<template>
  <div
    class="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4"
  >
    <div class="w-full max-w-2xl p-8 bg-white rounded shadow-md space-y-6">
      <!-- Page Header -->
      <h1 class="text-3xl font-bold text-center text-gray-800 mb-6">
        About Fakaloan
      </h1>

      <!-- Introduction Section -->
      <section>
        <h2 class="text-xl font-semibold text-gray-700 mb-2">
          Welcome to Fakaloan!
        </h2>
        <p class="text-gray-600 leading-relaxed">
          Fakaloan is a software tool designed to help businesses manage credit
          and collections effectively. We are proudly South African, building
          solutions tailored for our local market.
        </p>
        <p class="text-gray-600 leading-relaxed mt-2 font-medium">
          Please note: Fakaloan is a platform for tracking and managing credit
          you extend to your customers. We do not provide loans, credit, or
          financial services ourselves.
        </p>
      </section>

      <!-- Features Section -->
      <section>
        <h2 class="text-xl font-semibold text-gray-700 mb-2">What We Offer</h2>
        <p class="text-gray-600 leading-relaxed">
          Our platform provides tools to help you streamline your financial
          processes by enabling you to:
        </p>
        <ul class="list-disc list-inside text-gray-600 space-y-1 mt-2 pl-4">
          <li>Track credit you have extended to your clients.</li>
          <li>Manage and simplify your collections process.</li>
          <li>Gain insights into your cash flow through analytics.</li>
          <li>
            Utilise tools aimed at reducing bad debt and improving your recovery
            rates.
          </li>
        </ul>
      </section>

      <!-- Legal Disclaimer Section -->
      <section>
        <h2 class="text-xl font-semibold text-gray-700 mb-2">Disclaimer</h2>
        <p class="text-gray-600 leading-relaxed font-semibold">
          Fakaloan is a software-as-a-service (SaaS) platform. We are not a
          registered credit provider, financial advisor, or debt collector. The
          tools and information provided are for management and tracking
          purposes only and should not be considered financial advice. Users are
          responsible for ensuring their credit and collection practices comply
          with all applicable laws and regulations.
        </p>
      </section>

      <!-- Language Support Section -->
      <section>
        <h2 class="text-xl font-semibold text-gray-700 mb-2">
          Language Support
        </h2>
        <p class="text-gray-600 leading-relaxed">
          Currently, Fakaloan primarily supports English. However, as a proudly
          South African company, we are committed to inclusivity and plan to
          support all official South African languages in the future.
        </p>
      </section>

      <!-- Contact Information Section -->
      <section>
        <h2 class="text-xl font-semibold text-gray-700 mb-2">Need Help?</h2>
        <p class="text-gray-600 leading-relaxed">
          If you have any questions, encounter issues, or need assistance,
          please don't hesitate to reach out to our support team.
        </p>
        <p class="text-gray-600 mt-2">
          Email us at:
          <a
            href="mailto:admin@fakaloan.co.za"
            class="text-indigo-600 hover:text-indigo-800 underline"
            >admin@fakaloan.co.za</a
          >
        </p>
      </section>

      <!-- Navigation Button -->
      <div class="text-center mt-8">
        <router-link to="/" class="btn-secondary !w-auto"
          >Back to Home</router-link
        >
      </div>
    </div>

    <!-- Footer -->
    <footer class="w-full max-w-2xl text-center text-gray-500 text-sm mt-8">
      <p>
        &copy; {{ new Date().getFullYear() }} Timothy Brits. All rights
        reserved.
      </p>
      <p class="mt-1">Proudly South African 🇿🇦</p>
    </footer>
  </div>
</template>
