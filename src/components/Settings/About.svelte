<script>
  import { userData } from "../../store";

  let darkMode = false;

  userData.subscribe((data) => {
    darkMode = data.darkMode;
  });

  const reviewClick = () => {
    if(navigator.userAgent.indexOf("Firefox") === -1) {
      window.location.assign("https://chromewebstore.google.com/detail/onhhmnkghemlcnlglcnjkhebiclbklpl/reviews");
    }
    else {
      window.location.assign("https://addons.mozilla.org/en-US/firefox/addon/metro-speed-dial-new-tab-page");
    }
  }

  const supportClick = () => {
    if(navigator.userAgent.indexOf("Firefox") === -1) {
      window.location.assign("https://chromewebstore.google.com/detail/onhhmnkghemlcnlglcnjkhebiclbklpl/support");
    }
    else {
      window.location.assign("https://github.com/KlibrDM/metro-tab/issues");
    }
  }
</script>

<div class="about" class:darkModifier={darkMode}>
  <div class="about-image">
    {#if darkMode}
      <img src="static/images/about/a_hi_dark.png" alt="Hi!" />
    {:else}
      <img src="static/images/about/a_hi.png" alt="Hi!" />
    {/if}
  </div>

  <div class="about-text" style="margin-top: 30px;">
    <span style="font-size: 4.5rem;"><strong style="color: #3a99ff;">Thank you</strong> for using this extension!</span>
  </div>

  <div class="about-text" style="margin-top: 20px;">
    <span style="font-size: 1.8rem;">This project is developed by <strong style="color: #3a99ff;">PatrickCC</strong>.</span>
  </div>

  <div class="about-text" style="margin-top: 20px;">
    <span style="font-size: 1.8rem;">The code is open source and you can check it out <a href="https://github.com/KlibrDM/metro-tab/" class="about-github-link">here</a>.</span>
  </div>

  <div class="about-section">
    <h2>Review</h2>
    <span>Your feedback is appreciated. You can rate this extension and write a review.</span>
    <button on:click={reviewClick}>Rate & Review</button>
  </div>

  <div class="about-section">
    <h2>Support</h2>
    <span>If you have any questions, issues or suggestions, feel free to use the support page.</span>
    <button on:click={supportClick}>User Support</button>
  </div>
</div>

<style>
  .about {
    display: flex;
    flex-direction: column;
    color: black;
    padding-right: 8px;
  }
  .about.darkModifier {
    color: white;
  }
  .about-image {
    user-select: none;
    pointer-events: none;
    min-height: 204px;
    margin-top: 20px;
  }
  .about-github-link {
    color: #3a99ff;
    transition: 0.3s;
  }
  .about-github-link:hover {
    color: #2373c9;
  }
  .about-section {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin-top: 40px;
    gap: 16px;
  }
  .about-section h2 {
    color: #3a99ff;
    margin-block-start: 0;
    margin-block-end: 0;
  }
  .about-section span {
    font-size: 1.1rem;
  }
  .about-section button {
    font-size: 1rem;
    padding: 10px 20px;
    border: 0;
    border-radius: 10px;
    cursor: pointer;
    color: white;
    background-color: #3a99ff;
    transition: 0.3s;
  }
  .about-section button:hover {
    background-color: #2f84e0;
  }
</style>
