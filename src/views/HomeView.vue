<script setup>
import { ref } from "vue";
import { CheckCircle2, CircleAlert, LoaderCircle, Send } from "@lucide/vue";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { getSupabaseClient } from "@/lib/supabase";

const name = ref("");
const pending = ref(false);
const message = ref("");
const errorMessage = ref("");

async function sendGreeting() {
  if (pending.value) return;
  message.value = "";
  errorMessage.value = "";
  const trimmedName = name.value.trim();
  if (!trimmedName || trimmedName.length > 100) {
    errorMessage.value = "Enter a name between 1 and 100 characters.";
    return;
  }

  pending.value = true;
  try {
    const { data, error } = await getSupabaseClient().functions.invoke(
      "hello-world",
      {
        body: { name: trimmedName },
      },
    );
    if (error) throw error;
    if (typeof data?.message !== "string") {
      throw new Error("The function returned an unexpected response.");
    }
    message.value = data.message;
  } catch (error) {
    errorMessage.value =
      error instanceof Error
        ? error.message
        : "Unable to send the request. Try again.";
  } finally {
    pending.value = false;
  }
}
</script>

<template>
  <section aria-labelledby="greeting-heading" class="max-w-xl">
    <div class="mb-8 border-b pb-6">
      <p class="mb-2 text-sm font-medium text-primary">Meal Planner</p>
      <h1 id="greeting-heading" class="text-3xl font-semibold">Say hello</h1>
    </div>
    <form class="space-y-5" :aria-busy="pending" @submit.prevent="sendGreeting">
      <div class="space-y-2">
        <Label for="greeting-name">Name</Label>
        <Input
          id="greeting-name"
          v-model="name"
          name="name"
          autocomplete="given-name"
          placeholder="Your name"
          required
          maxlength="100"
          :disabled="pending"
        />
      </div>
      <Button type="submit" :disabled="pending">
        <LoaderCircle v-if="pending" class="animate-spin" aria-hidden="true" />
        <Send v-else aria-hidden="true" />
        {{ pending ? "Sending..." : "Send greeting" }}
      </Button>
    </form>
    <div class="mt-6" aria-live="polite" aria-atomic="true">
      <Alert v-if="message" data-testid="greeting-result">
        <CheckCircle2 aria-hidden="true" />
        <AlertTitle>Response</AlertTitle>
        <AlertDescription class="wrap-anywhere">{{ message }}</AlertDescription>
      </Alert>
      <Alert v-if="errorMessage" variant="destructive">
        <CircleAlert aria-hidden="true" />
        <AlertTitle>Request failed</AlertTitle>
        <AlertDescription class="wrap-anywhere">{{
          errorMessage
        }}</AlertDescription>
      </Alert>
    </div>
  </section>
</template>
