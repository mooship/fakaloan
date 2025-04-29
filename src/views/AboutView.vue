<script setup lang="ts">
import { useTitle } from '@vueuse/core';
useTitle('About | Fakaloan');
</script>

<template>
  <div
    class="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-4"
  >
    <div class="w-full max-w-2xl space-y-6 rounded bg-white p-8 shadow-md">
      <h1 class="mb-6 text-center text-3xl font-bold text-gray-800">
        About Fakaloan
      </h1>

      <section>
        <h2 class="mb-2 text-xl font-semibold text-gray-700">
          Welcome to Fakaloan!
        </h2>
        <p class="leading-relaxed text-gray-600">
          Fakaloan is a software tool designed to help businesses manage credit
          and collections effectively. We are proudly South African, building
          solutions tailored for our local market.
        </p>
        <p class="mt-2 font-medium leading-relaxed text-gray-600">
          Please note: Fakaloan is a platform for tracking and managing credit
          you extend to your customers. We do not provide loans, credit, or
          financial services ourselves.
        </p>
      </section>

      <section>
        <h2 class="mb-2 text-xl font-semibold text-gray-700">What We Offer</h2>
        <p class="leading-relaxed text-gray-600">
          Our platform provides tools to help you streamline your financial
          processes by enabling you to:
        </p>
        <ul class="mt-2 list-inside list-disc space-y-1 pl-4 text-gray-600">
          <li>Track credit you have extended to your clients.</li>
          <li>Manage and simplify your collections process.</li>
          <li>Gain insights into your cash flow through analytics.</li>
          <li>
            Utilise tools aimed at reducing bad debt and improving your recovery
            rates.
          </li>
        </ul>
      </section>

      <section>
        <h2 class="mb-2 text-xl font-semibold text-gray-700">Disclaimer</h2>
        <p class="font-semibold leading-relaxed text-gray-600">
          Fakaloan is a software-as-a-service (SaaS) platform. We are not a
          registered credit provider, financial advisor, or debt collector. The
          tools and information provided are for management and tracking
          purposes only and should not be considered financial advice. Users are
          responsible for ensuring their credit and collection practices comply
          with all applicable laws and regulations.
        </p>
      </section>

      <section>
        <h2 class="mb-2 text-xl font-semibold text-gray-700">
          Language Support
        </h2>
        <p class="leading-relaxed text-gray-600">
          Currently, Fakaloan primarily supports English. However, as a proudly
          South African company, we are committed to inclusivity and plan to
          support all official South African languages in the future.
        </p>
      </section>

      <section>
        <h2 class="mb-2 text-xl font-semibold text-gray-700">Need Help?</h2>
        <p class="leading-relaxed text-gray-600">
          If you have any questions, encounter issues, or need assistance,
          please don't hesitate to reach out to our support team.
        </p>
        <p class="mt-2 text-gray-600">
          Email us at:
          <a
            href="mailto:admin@fakaloan.co.za"
            class="text-indigo-600 underline hover:text-indigo-800"
            >admin@fakaloan.co.za</a
          >
        </p>
      </section>

      <div class="mt-8 text-center">
        <router-link to="/" class="btn-secondary !w-auto"
          >Back to Home</router-link
        >
      </div>
    </div>

    <footer class="mt-8 w-full max-w-2xl text-center text-sm text-gray-500">
      <p>
        &copy; {{ new Date().getFullYear() }} Timothy Brits. All rights
        reserved.
      </p>
      <p class="mt-1">Proudly South African 🇿🇦</p>
    </footer>
  </div>
</template>
