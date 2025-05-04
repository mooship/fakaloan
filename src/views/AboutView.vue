<script setup lang="ts">
import BackButton from '@/components/BackButton.vue';
import AppLayout from '@/layouts/AppLayout.vue';
import { useTitle } from '@vueuse/core';
useTitle('About | Fakaloan');
</script>

<template>
  <AppLayout>
    <div
      class="bg-background flex min-h-screen flex-col items-center justify-center p-4"
    >
      <div class="card-main">
        <h1 class="text-primary mb-6 text-center text-3xl font-bold">
          About Fakaloan
        </h1>

        <section>
          <h2 class="text-on-surface mb-2 text-xl font-semibold">
            Welcome to Fakaloan!
          </h2>
          <p class="text-on-surface/80 leading-relaxed">
            Fakaloan is a software tool designed to help businesses manage
            credit and collections effectively. We are proudly South African,
            building solutions tailored for our local market.
          </p>
          <p class="text-on-surface/80 mt-2 font-medium leading-relaxed">
            Please note: Fakaloan is a platform for tracking and managing credit
            you extend to your customers. We do not provide loans, credit, or
            financial services ourselves.
          </p>
        </section>

        <section>
          <h2 class="text-on-surface mb-2 text-xl font-semibold">
            What We Offer
          </h2>
          <p class="text-on-surface/80 leading-relaxed">
            Our platform provides tools to help you streamline your financial
            processes by enabling you to:
          </p>
          <ul
            class="text-on-surface-80 mt-2 list-inside list-disc space-y-1 pl-4"
          >
            <li>Track credit you have extended to your clients.</li>
            <li>Manage and simplify your collections process.</li>
            <li>Gain insights into your cash flow through analytics.</li>
            <li>
              Utilise tools aimed at reducing bad debt and improving your
              recovery rates.
            </li>
          </ul>
        </section>

        <section>
          <h2 class="text-on-surface mb-2 text-xl font-semibold">Disclaimer</h2>
          <p class="text-on-surface/80 font-semibold leading-relaxed">
            Fakaloan is a software-as-a-service (SaaS) platform. We are not a
            registered credit provider, financial advisor, or debt collector.
            The tools and information provided are for management and tracking
            purposes only and should not be considered financial advice. Users
            are responsible for ensuring their credit and collection practices
            comply with all applicable laws and regulations.
          </p>
        </section>

        <section>
          <h2 class="text-on-surface mb-2 text-xl font-semibold">
            Language Support
          </h2>
          <p class="text-on-surface/80 leading-relaxed">
            Currently, Fakaloan primarily supports English. However, as a
            proudly South African company, we are committed to inclusivity and
            plan to support all official South African languages in the future.
          </p>
        </section>

        <section>
          <h2 class="text-on-surface mb-2 text-xl font-semibold">Need Help?</h2>
          <p class="text-on-surface/80 leading-relaxed">
            If you have any questions, encounter issues, or need assistance,
            please don't hesitate to reach out to our support team.
          </p>
          <p class="text-on-surface/80 mt-2">
            Email us at:
            <a
              href="mailto:admin@fakaloan.co.za"
              class="text-primary hover:text-primary-variant underline"
              >admin@fakaloan.co.za</a
            >
          </p>
        </section>

        <div class="section-divider mt-8 flex justify-center">
          <BackButton />
        </div>
        <footer
          class="text-on-surface-60 mt-8 w-full max-w-2xl text-center text-sm"
        >
          <p>
            &copy; {{ new Date().getFullYear() }} Timothy Brits. All rights
            reserved.
          </p>
          <p class="mt-1">Proudly South African 🇿🇦</p>
        </footer>
      </div>
    </div>
  </AppLayout>
</template>
