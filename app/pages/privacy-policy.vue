<template>
  <div class="flex flex-col items-center justify-center gap-4 p-4 min-h-screen">
    <div>
      <h1 class="text-2xl font-bold mb-4">Privacy Policy for Sempurna Baja</h1>
      <p class="mb-4">
        <strong>Last updated: January 4, 2026</strong>
      </p>

      <p class="mb-4">
        At <strong>Sempurna Baja</strong>, we take your privacy seriously. This Privacy Policy outlines the
        information we collect and how we use it.
      </p>

      <h3 class="text-lg font-semibold mt-6 mb-3">1. Information We Collect</h3>
      <p class="mb-4">
        When you sign in to Sempurna Baja using <strong>Google Login</strong>, we collect the following
        information:
      </p>
      <ul class="list-disc list-inside mb-4">
        <li class="mb-2">Your <strong>email address</strong> associated with your Google account</li>
      </ul>
      <p class="mb-4">
        We <strong>do not</strong> collect your name, profile picture, contacts, or any other personal
        information.
      </p>

      <h3 class="text-lg font-semibold mt-6 mb-3">2. How We Use Your Information</h3>
      <p class="mb-4">We use your email address for the following purposes:</p>
      <ul class="list-disc list-inside mb-4">
        <li class="mb-2">To identify and authenticate you securely</li>
        <li class="mb-2">To associate your account and data within the Sempurna Baja application</li>
      </ul>
      <p class="mb-4">We do <strong>not</strong> share your email address with third parties.</p>

      <h3 class="text-lg font-semibold mt-6 mb-3">3. Data Storage</h3>
      <p class="mb-4">
        All data is stored securely and used solely for providing the Sempurna Baja service. We implement
        standard
        security measures to protect your information.
      </p>

      <h3 class="text-lg font-semibold mt-6 mb-3">4. Third-Party Services</h3>
      <p class="mb-4">
        We use <strong>Google OAuth</strong> to allow users to log in securely. By using Google sign-in, you
        are
        also
        subject to Google's
        <a
          href="https://policies.google.com/privacy"
          target="_blank"
          rel="noopener noreferrer"
          class="text-blue-400 hover:text-blue-300 underline">Privacy Policy</a>.
      </p>

      <h3 class="text-lg font-semibold mt-6 mb-3">5. Your Consent</h3>
      <p class="mb-4">By using Sempurna Baja, you consent to this privacy policy.</p>

      <h3 class="text-lg font-semibold mt-6 mb-3">6. Changes to This Policy</h3>
      <p class="mb-4">
        We may update this Privacy Policy from time to time. When we do, we will update the date at the top
        of this
        page.
      </p>

      <h3 class="text-lg font-semibold mt-6 mb-3">7. Contact</h3>
      <p class="mb-4">If you have any questions about this Privacy Policy, please contact us at:</p>
      <p class="mb-4">
        📧
        <a
          href="mailto:ianfebi01@gmail.com"
          class="text-blue-400 hover:text-blue-300 underline">ianfebi01@gmail.com</a>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
useSeoMeta( {
    title       : "Privacy Policy - Sempurna Baja",
    description : "Privacy Policy for Sempurna Baja - Learn how we collect and use your information when you sign in with Google OAuth.",
    ogTitle     : "Privacy Policy - Sempurna Baja",
    ogDescription:
        "Privacy Policy for Sempurna Baja - Learn how we collect and use your information when you sign in with Google OAuth.",
    twitterTitle: "Privacy Policy - Sempurna Baja",
    twitterDescription:
        "Privacy Policy for Sempurna Baja - Learn how we collect and use your information when you sign in with Google OAuth.",
} )

definePageMeta( {
    layout: false,
} )
</script>
