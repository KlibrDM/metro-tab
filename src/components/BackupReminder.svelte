<script>
  import moment from "moment";
  import { getBackupReminderDate, getLastBackupDate, setBackupReminderDate } from "../data/storage";

  let innerWidth = 0;

  let lastBackupDate = getLastBackupDate();
  let backupReminderDate = getBackupReminderDate();

  const setReminder = (days) => {
    const date = moment().add(days, "days").toDate();
    setBackupReminderDate(date);
    backupReminderDate = date;
  }

  setInterval(() => {
    lastBackupDate = getLastBackupDate();
    backupReminderDate = getBackupReminderDate();
  }, 3000);
</script>

<svelte:window bind:innerWidth />

{#if innerWidth > 799
  && lastBackupDate && moment(lastBackupDate).isBefore(moment().subtract(30, "days"))
  && (!backupReminderDate || (backupReminderDate && moment(backupReminderDate).isBefore(moment())))
}
  <div id="backupReminder">
    <div class="backupReminderMessage">
      <h4>Settings backup</h4>
      <p>You haven't backed up your settings since {moment(lastBackupDate).format("DD MMMM YYYY")}.</p>
      <p>Please go to <i class="fas fa-sliders-h" /> Settings, then Backup, and export your current settings to keep your data backed up.</p>
    </div>

    <div class="backupReminderButtons">
      <button class="backupRemindButton" on:click={() => setReminder(3)}>
        Remind me in 3 days
      </button>
      <button class="backupReminderCloseButton" on:click={() => setReminder(90)}>
        Close
      </button>
    </div>
  </div>
{/if}

<style>
  h4 {
    margin-block-start: 0em;
    margin-block-end: 0.4em;
  }
  p {
    margin: 0;
    word-wrap: break-word;
  }
  i {
    margin-left: 4px;
    margin-right: 4px;
    font-size: 0.9em;
  }
  #backupReminder {
    position: absolute;
    bottom: 48px;
    right: 2vw;
    z-index: 7;
    background-color: rgba(0, 0, 0, 0.45);
    border: 2px solid;
    border-color: rgba(0, 0, 0, 0.4);
    border-radius: 12px;
    max-width: 460px;
    color: white;
    padding: 6px 12px;
    display: flex;
    flex-direction: column;
  }
  .backupReminderButtons {
    margin-left: auto;
    display: flex;
    gap: 8px;
  }
  .backupRemindButton {
    margin-top: 8px;
    padding: 8px 20px;
    border: 0;
    border-radius: 10px;
    cursor: pointer;
    color: black;
    background-color: rgb(238, 218, 34);
    transition: 0.3s;
  }
  .backupRemindButton:hover {
    background-color: rgb(230, 200, 22);
  }
  .backupReminderCloseButton {
    margin-top: 8px;
    padding: 8px 20px;
    border: 0;
    border-radius: 10px;
    cursor: pointer;
    color: black;
    background-color: #fff;
    transition: 0.3s;
  }
  .backupReminderCloseButton:hover {
    background-color: #f0f0f0;
  }
</style>
