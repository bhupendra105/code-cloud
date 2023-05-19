export let textLoad = {
  default: `<button class="text-send btn btn-primary btn-lg mt-2" id="textsend">
              Send
            </button>`,
  change: `
    <button class="btn btn-primary mt-2" type="button"id="textsend" disabled>
  <span class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>
  Sending...
</button>
    `,
};
