<script lang="ts">
  import { mode } from "./app-theme.svelte";
</script>

<label
  for="theme-controller"
  aria-label="toggle theme"
  class="toggle text-base-content"
>
  <input
    oninput={(event) => {
      mode.current = event.currentTarget.checked ? "dark" : "light";
    }}
    id="theme-controller"
    type="checkbox"
    class="theme-controller"
  />

  <iconify-icon icon="lucide:sun" width="12"></iconify-icon>
  <iconify-icon icon="lucide:moon-star" width="12"></iconify-icon>
</label>
