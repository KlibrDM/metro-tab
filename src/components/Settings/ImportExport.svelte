<script>
  import moment from "moment";
  import { deleteAllTileImages, getIsDefaultBackupDate, getLastBackupDate, getTileImage, getTileImageLinks, parseNotes, saveBackground, saveTileImage, setLastBackupDate, unsetIsDefaultBackupDate } from "../../data/storage";
  import { backgroundImage as DEFAULT_BACKGROUND_IMAGE } from "../../data/config";

  export let settingsData;
  export let saveSettings;

  let lastBackupDate = getLastBackupDate();
  let isDefaultBackupDate = getIsDefaultBackupDate();

  let settings, fileInput;
  let importPages = true, importTileImages = true, importBackground = true, importVisuals = true, importNotes = true, importSearchEngine = true;
  let exportPages = true, exportTileImages = true, exportBackground = true, exportVisuals = true, exportNotes = true, exportSearchEngine = true;

  // Keep track of import errors
  let importErrors = {
    pages: false,
    tileImages: false,
    background: false,
    visuals: false,
    searchEngine: false,
    notes: false,
  };
  let importFinishedSuccessfully = false; // False doesn't necesarily mean there were errors, just that no import was started

  const clearImportErrors = () => {
    importErrors = {
      pages: false,
      tileImages: false,
      background: false,
      visuals: false,
      searchEngine: false,
      notes: false,
    };
  }

  const updateLastBackupDate = () => {
    //Set the last backup date
    const date = new Date();
    setLastBackupDate(date);
    lastBackupDate = date;

    //If the last backup date is the default date, set it to false and unset the default date
    if(isDefaultBackupDate){
      isDefaultBackupDate = false;
      unsetIsDefaultBackupDate();
    }
  }

  const exportData = () => {
    //Create export object based on what the user wants to export
    let exportDataObject = {};
    if(exportPages){
      exportDataObject.pages = settingsData.pages;
      exportDataObject.categories = settingsData.categories;
    }
    if(exportNotes){
      exportDataObject.notes = settingsData.notes;
    }
    if(exportSearchEngine){
      exportDataObject.searchEngine = settingsData.searchEngine;
      if(settingsData.customSearchEngineUrl && settingsData.customSearchEngineUrl.length > 0) {
        exportDataObject.customSearchEngineUrl = settingsData.customSearchEngineUrl;
      }
    }
    if(exportBackground){
      exportDataObject.isBackgroundSolid = settingsData.isBackgroundSolid;
      exportDataObject.backgroundSolidColor = settingsData.backgroundSolidColor;
      exportDataObject.backgroundImage = settingsData.backgroundImage;
    }
    if(exportVisuals){
      exportDataObject.yourName = settingsData.yourName;
      exportDataObject.showCover = settingsData.showCover;
      exportDataObject.clockBackground = settingsData.clockBackground;
      exportDataObject.clock24Hour = settingsData.clock24Hour;
      exportDataObject.darkMode = settingsData.darkMode;
      exportDataObject.showSearchBar = settingsData.showSearchBar;
      exportDataObject.tileZoom = settingsData.tileZoom;
      exportDataObject.tileGrow = settingsData.tileGrow;
      exportDataObject.tileMinWidth = settingsData.tileMinWidth;
      exportDataObject.tileHeight = settingsData.tileHeight;
      exportDataObject.tileGap = settingsData.tileGap;
      exportDataObject.tileBorder = settingsData.tileBorder;
      exportDataObject.tileBorderRadius = settingsData.tileBorderRadius;
      exportDataObject.tileBorderColor = settingsData.tileBorderColor;
      exportDataObject.groupTileGap = settingsData.groupTileGap;
      exportDataObject.groupTileBorderRadius = settingsData.groupTileBorderRadius;
      exportDataObject.groupTileGrow = settingsData.groupTileGrow;
      exportDataObject.navbarOpacity = settingsData.navbarOpacity;
      exportDataObject.navbarColor = settingsData.navbarColor;
      exportDataObject.coverColor = settingsData.coverColor;
      exportDataObject.coverTextColor = settingsData.coverTextColor;
    }
    if(exportTileImages){
      const links = getTileImageLinks();
      links.forEach(link => {
        exportDataObject[link] = getTileImage(link);
      });
    }

    //Update last backup date
    updateLastBackupDate();

    //Set the anchor tag to download the file
    let dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportDataObject));
    let dlAnchorElem = document.getElementById('downloadAnchorElem');
    dlAnchorElem.setAttribute("href", dataStr);
    dlAnchorElem.setAttribute("download", "metro-tab-config.json");
    dlAnchorElem.click();
  }

  const onFileSelected = (e) => {
    let file = e.target.files[0];
    let reader = new FileReader();
    reader.readAsText(file);
    reader.onload = (e) => {
      try{
        settings = JSON.parse(e.target.result);

        clearImportErrors();
        importFinishedSuccessfully = false;

        //Use already existing settings and change what is needed
        let settingsToSave = settingsData;

        //Check pages for errors then import
        if(importPages){
          let errorsFound = false;

          if(settings.pages){
            settings.pages.forEach(page => {
              if(page.isGroup){
                // Handle group import
                if(!page.hasOwnProperty('name') || !page.hasOwnProperty('pages') || !Array.isArray(page.pages)){
                  errorsFound = true;
                }

                page.pages.forEach(subPage => {
                  if(!subPage.hasOwnProperty('link')
                    || !subPage.hasOwnProperty('imageName')
                    || !subPage.hasOwnProperty('isActive')){
                    errorsFound = true;
                  }

                  // Set defaults if missing
                  if(!errorsFound && !subPage.hasOwnProperty('tileImageType')){
                    subPage.tileImageType = subPage.imageName.length > 1 ? 'predefined' : 'none';
                  }

                  if(!errorsFound && !subPage.hasOwnProperty('tileName')){
                    subPage.tileName = subPage.imageName[0].toUpperCase() + subPage.imageName.slice(1);
                  }

                  if(!errorsFound && !subPage.hasOwnProperty('backgroundColor')){
                    subPage.backgroundColor = "#3a99ff";
                  }

                  if(!errorsFound && !subPage.hasOwnProperty('textColor')){
                    subPage.textColor = "#ffffff";
                  }
                });
              }
              else {
                // Handle page import
                if(!page.hasOwnProperty('link')
                  || !page.hasOwnProperty('imageName')
                  || !page.hasOwnProperty('isActive')){
                  errorsFound = true;
                }

                // Set defaults if missing
                if(!errorsFound && !page.hasOwnProperty('tileImageType')){
                  page.tileImageType = page.imageName.length > 1 ? 'predefined' : 'none';
                }

                if(!errorsFound && !page.hasOwnProperty('tileName')){
                  page.tileName = page.imageName[0].toUpperCase() + page.imageName.slice(1);
                }

                if(!errorsFound && !page.hasOwnProperty('backgroundColor')){
                  page.backgroundColor = "#3a99ff";
                }

                if(!errorsFound && !page.hasOwnProperty('textColor')){
                  page.textColor = "#ffffff";
                }
              }
            });
          }
          else{
            errorsFound = true;
          }

          if(settings.categories) {
            settings.categories.forEach(category => {
              if(!category.hasOwnProperty('id') || !category.hasOwnProperty('name')){
                errorsFound = true;
              }
            });
          }
          else {
            //If there are no categories in the settings, remove the category from the pages
            settings.pages.forEach(page => {
              if(page.hasOwnProperty('categoryId')){
                delete page.categoryId;
              }
            });
          }

          //If no errors found, add pages to settings
          if(!errorsFound){
            settingsToSave.pages = settings.pages;
            settingsToSave.categories = settings.categories || [];
          }
          else{
            importErrors.pages = true;
          }
        }

        //Check notes for errors then import
        if(importNotes){
          let errorsFound = false

          if(settings.notes){
            settings.notes.forEach(note => {
              if(!note.hasOwnProperty('text') || !note.hasOwnProperty('completed')){
                errorsFound = true;
              }
            });
          }
          else{
            errorsFound = true;
          }

          if(!errorsFound){
            settingsToSave.notes = parseNotes(settings.notes); // Will add default properties (for notes in v2.4.0 and older)
          }
          else{
            importErrors.notes = true;
          }
        }

        //Check search engine for errors then import
        if(importSearchEngine){
          let errorsFound = false;

          if(settings.hasOwnProperty('searchEngine')){
            if(typeof settings.searchEngine !== 'string'){
              errorsFound = true;
            }
          }
          else{
            errorsFound = true;
          }

          //Custom Search Engine URL is optional, but if it exists, it must be a string and contain %s
          if(settings.hasOwnProperty('customSearchEngineUrl')){
            if(typeof settings.customSearchEngineUrl !== 'string'
              || settings.customSearchEngineUrl.length === 0
              || settings.customSearchEngineUrl.indexOf("%s") === -1
              || (settings.customSearchEngineUrl.substring(0, 7) !== "http://" && settings.customSearchEngineUrl.substring(0, 8) !== "https://")
            ){
              errorsFound = true;
            }
          }

          if(!errorsFound){
            settingsToSave.searchEngine = settings.searchEngine;
            if(settings.hasOwnProperty('customSearchEngineUrl')) {
              settingsToSave.customSearchEngineUrl = settings.customSearchEngineUrl;
            }
          }
          else{
            importErrors.searchEngine = true;
          }
        }

        //Before trying to import background, delete previous tile images if "import tile images" is checked
        //to prevent edge case where import fails due to not having enough space for custom background image
        if(importTileImages){
          deleteAllTileImages();
        }

        //Check backgrounds for errors then import
        if(importBackground){
          let errorsFound = false;

          //Check if isBackgroundSolid exists and if it's the right type
          if(settings.hasOwnProperty('isBackgroundSolid')){
            if(typeof settings.isBackgroundSolid !== 'boolean'){
              errorsFound = true;
            }
          }
          else{
            errorsFound = true;
          }

          //Check if backgroundSolidColor exists and if it's the right type
          if(settings.hasOwnProperty('backgroundSolidColor')){
            if(typeof settings.backgroundSolidColor !== 'string' 
              || settings.backgroundSolidColor.length !== 7 
              || settings.backgroundSolidColor.charAt(0) !== '#'
              || !settings.backgroundSolidColor.match(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)){
              errorsFound = true;
            }
          }
          else{
            errorsFound = true;
          }

          //Check if backgroundImage exists and if it's the right type
          if(settings.hasOwnProperty('backgroundImage')){
            if(typeof settings.backgroundImage !== 'string' || settings.backgroundImage.length === 0){
              errorsFound = true;
            }
            else {
              //If valid, clear up space ASAP
              saveBackground(DEFAULT_BACKGROUND_IMAGE);
            }
          }
          else{
            errorsFound = true;
          }

          if(!errorsFound) {
            settingsToSave.isBackgroundSolid = settings.isBackgroundSolid;
            settingsToSave.backgroundSolidColor = settings.backgroundSolidColor;
            settingsToSave.backgroundImage = settings.backgroundImage;
          }
          else{
            importErrors.background = true;
          }
        }

        //Import all valid tile images
        if(importTileImages){
          for(let key in settings) {
            if(key.indexOf("http") !== -1) {
              const image = settings[key];
              if(typeof image === 'string' && image.length > 0){
                saveTileImage(key, image);
              }
            }
          }
        }

        //Check visuals for errors then import
        if(importVisuals){
          let errorsFound = false;

          if(settings.hasOwnProperty('yourName')){
            if(typeof settings.yourName !== 'string'){
              errorsFound = true;
            }
          }
          else{
            errorsFound = true;
          }

          if(settings.hasOwnProperty('showCover')){
            if(typeof settings.showCover !== 'boolean'){
              errorsFound = true;
            }
          }
          else{
            errorsFound = true;
          }

          if(settings.hasOwnProperty('clockBackground')){
            if(typeof settings.clockBackground !== 'boolean'){
              errorsFound = true;
            }
          }
          else{
            errorsFound = true;
          }

          if(settings.hasOwnProperty('clock24Hour')){
            if(typeof settings.clock24Hour !== 'boolean'){
              errorsFound = true;
            }
          }
          else{
            errorsFound = true;
          }

          if(settings.hasOwnProperty('darkMode')){
            if(typeof settings.darkMode !== 'boolean'){
              errorsFound = true;
            }
          }
          else{
            errorsFound = true;
          }

          if(settings.hasOwnProperty('showSearchBar')){
            if(typeof settings.showSearchBar !== 'boolean'){
              errorsFound = true;
            }
          }
          else{
            errorsFound = true;
          }

          if(settings.hasOwnProperty('tileZoom')){
            if(typeof settings.tileZoom !== 'boolean'){
              errorsFound = true;
            }
          }
          else{
            errorsFound = true;
          }

          if(settings.hasOwnProperty('tileGrow')){
            if(typeof settings.tileGrow !== 'boolean'){
              errorsFound = true;
            }
          }
          else{
            errorsFound = true;
          }

          if(settings.hasOwnProperty('tileMinWidth')){
            settings.tileMinWidth = parseFloat(settings.tileMinWidth);
            if(typeof settings.tileMinWidth !== 'number' || settings.tileMinWidth < 10 || settings.tileMinWidth > 150){
              errorsFound = true;
            }
          }
          else{
            errorsFound = true;
          }

          if(settings.hasOwnProperty('tileHeight')){
            settings.tileHeight = parseFloat(settings.tileHeight);
            if(typeof settings.tileHeight !== 'number' || settings.tileHeight < 5 || settings.tileHeight > 80){
              errorsFound = true;
            }
          }
          else{
            errorsFound = true;
          }

          if(settings.hasOwnProperty('tileGap')){
            settings.tileGap = parseFloat(settings.tileGap);
            if(typeof settings.tileGap !== 'number' || settings.tileGap < 0 || settings.tileGap > 30){
              errorsFound = true;
            }
          }
          else{
            errorsFound = true;
          }

          if(settings.hasOwnProperty('tileBorder')){
            settings.tileBorder = parseFloat(settings.tileBorder);
            if(typeof settings.tileBorder !== 'number' || settings.tileBorder < 0 || settings.tileBorder > 50){
              errorsFound = true;
            }
          }
          else{
            errorsFound = true;
          }

          if(settings.hasOwnProperty('tileBorderRadius')){
            settings.tileBorderRadius = parseFloat(settings.tileBorderRadius);
            if(typeof settings.tileBorderRadius !== 'number' || settings.tileBorderRadius < 0 || settings.tileBorderRadius > 80){
              errorsFound = true;
            }
          }
          else{
            errorsFound = true;
          }

          if(settings.hasOwnProperty('groupTileGap')){
            settings.groupTileGap = parseFloat(settings.groupTileGap);
            if(typeof settings.groupTileGap !== 'number' || settings.groupTileGap < 0 || settings.groupTileGap > 5){
              errorsFound = true;
            }
          }
          else{
            errorsFound = true;
          }

          if(settings.hasOwnProperty('groupTileBorderRadius')){
            settings.groupTileBorderRadius = parseFloat(settings.groupTileBorderRadius);
            if(typeof settings.groupTileBorderRadius !== 'number' || settings.groupTileBorderRadius < 0 || settings.groupTileBorderRadius > 80){
              errorsFound = true;
            }
          }
          else{
            errorsFound = true;
          }

          if(settings.hasOwnProperty('groupTileGrow')){
            if(typeof settings.groupTileGrow !== 'boolean'){
              errorsFound = true;
            }
          }
          else{
            errorsFound = true;
          }

          if(settings.hasOwnProperty('navbarOpacity')){
            settings.navbarOpacity = parseFloat(settings.navbarOpacity);
            if(typeof settings.navbarOpacity !== 'number' || settings.navbarOpacity < 0 || settings.navbarOpacity > 1){
              errorsFound = true;
            }
          }
          else{
            errorsFound = true;
          }

          if(settings.hasOwnProperty('tileBorderColor')){
            if(settings.tileBorderColor.hasOwnProperty('r') && settings.tileBorderColor.hasOwnProperty('g') && settings.tileBorderColor.hasOwnProperty('b')){
              settings.tileBorderColor.r = parseFloat(settings.tileBorderColor.r);
              if(typeof settings.tileBorderColor.r !== 'number' || settings.tileBorderColor.r < 0 || settings.tileBorderColor.r > 255){
                errorsFound = true;
              }
              settings.tileBorderColor.g = parseFloat(settings.tileBorderColor.g);
              if(typeof settings.tileBorderColor.g !== 'number' || settings.tileBorderColor.g < 0 || settings.tileBorderColor.g > 255){
                errorsFound = true;
              }
              settings.tileBorderColor.b = parseFloat(settings.tileBorderColor.b);
              if(typeof settings.tileBorderColor.b !== 'number' || settings.tileBorderColor.b < 0 || settings.tileBorderColor.b > 255){
                errorsFound = true;
              }
            }
            else{
              errorsFound = true;
            }
          }
          else{
            errorsFound = true;
          }

          if(settings.hasOwnProperty('navbarColor')){
            if(settings.navbarColor.hasOwnProperty('r') && settings.navbarColor.hasOwnProperty('g') && settings.navbarColor.hasOwnProperty('b')){
              settings.navbarColor.r = parseFloat(settings.navbarColor.r);
              if(typeof settings.navbarColor.r !== 'number' || settings.navbarColor.r < 0 || settings.navbarColor.r > 255){
                errorsFound = true;
              }
              settings.navbarColor.g = parseFloat(settings.navbarColor.g);
              if(typeof settings.navbarColor.g !== 'number' || settings.navbarColor.g < 0 || settings.navbarColor.g > 255){
                errorsFound = true;
              }
              settings.navbarColor.b = parseFloat(settings.navbarColor.b);
              if(typeof settings.navbarColor.b !== 'number' || settings.navbarColor.b < 0 || settings.navbarColor.b > 255){
                errorsFound = true;
              }
            }
            else{
              errorsFound = true;
            }
          }
          else{
            errorsFound = true;
          }

          if(settings.hasOwnProperty('coverColor')){
            if(settings.coverColor.hasOwnProperty('r') && settings.coverColor.hasOwnProperty('g') && settings.coverColor.hasOwnProperty('b')){
              settings.coverColor.r = parseFloat(settings.coverColor.r);
              if(typeof settings.coverColor.r !== 'number' || settings.coverColor.r < 0 || settings.coverColor.r > 255){
                errorsFound = true;
              }
              settings.coverColor.g = parseFloat(settings.coverColor.g);
              if(typeof settings.coverColor.g !== 'number' || settings.coverColor.g < 0 || settings.coverColor.g > 255){
                errorsFound = true;
              }
              settings.coverColor.b = parseFloat(settings.coverColor.b);
              if(typeof settings.coverColor.b !== 'number' || settings.coverColor.b < 0 || settings.coverColor.b > 255){
                errorsFound = true;
              }
            }
            else{
              errorsFound = true;
            }
          }
          else{
            errorsFound = true;
          }

          if(settings.hasOwnProperty('coverTextColor')){
            if(settings.coverTextColor.hasOwnProperty('r') && settings.coverTextColor.hasOwnProperty('g') && settings.coverTextColor.hasOwnProperty('b')){
              settings.coverTextColor.r = parseFloat(settings.coverTextColor.r);
              if(typeof settings.coverTextColor.r !== 'number' || settings.coverTextColor.r < 0 || settings.coverTextColor.r > 255){
                errorsFound = true;
              }
              settings.coverTextColor.g = parseFloat(settings.coverTextColor.g);
              if(typeof settings.coverTextColor.g !== 'number' || settings.coverTextColor.g < 0 || settings.coverTextColor.g > 255){
                errorsFound = true;
              }
              settings.coverTextColor.b = parseFloat(settings.coverTextColor.b);
              if(typeof settings.coverTextColor.b !== 'number' || settings.coverTextColor.b < 0 || settings.coverTextColor.b > 255){
                errorsFound = true;
              }
            }
            else{
              errorsFound = true;
            }
          }
          else{
            errorsFound = true;
          }

          if(!errorsFound) {
            settingsToSave.yourName = settings.yourName;
            settingsToSave.showCover = settings.showCover;
            settingsToSave.clockBackground = settings.clockBackground;
            settingsToSave.clock24Hour = settings.clock24Hour;
            settingsToSave.darkMode = settings.darkMode;
            settingsToSave.showSearchBar = settings.showSearchBar;
            settingsToSave.tileZoom = settings.tileZoom;
            settingsToSave.tileGrow = settings.tileGrow;
            settingsToSave.tileMinWidth = settings.tileMinWidth;
            settingsToSave.tileHeight = settings.tileHeight;
            settingsToSave.tileGap = settings.tileGap;
            settingsToSave.tileBorder = settings.tileBorder;
            settingsToSave.tileBorderRadius = settings.tileBorderRadius;
            settingsToSave.tileBorderColor = settings.tileBorderColor;
            settingsToSave.groupTileGap = settings.groupTileGap;
            settingsToSave.groupTileBorderRadius = settings.groupTileBorderRadius;
            settingsToSave.groupTileGrow = settings.groupTileGrow;
            settingsToSave.navbarOpacity = settings.navbarOpacity;
            settingsToSave.navbarColor = settings.navbarColor;
            settingsToSave.coverColor = settings.coverColor;
            settingsToSave.coverTextColor = settings.coverTextColor;
          }
          else{
            importErrors.visuals = true;
          }
        }

        if(!importErrors.pages
          && !importErrors.tileImages
          && !importErrors.background
          && !importErrors.visuals
          && !importErrors.searchEngine
          && !importErrors.notes
        ){
          // If there are no errors, set flag for success message
          importFinishedSuccessfully = true;
        }

        // Update last backup date
        updateLastBackupDate();

        saveSettings(settingsToSave);
      }
      catch(e) {
        if(e.name === "QuotaExceededError") {
          alert("Not enough space in local storage to import settings. Please remove some custom tile images or the custom background image and try again.")
        }
        else {
          alert("Invalid configuration file.");
        }
      }
    };
  };
</script>

<div class="IEPage" class:darkModifier={settingsData.darkMode}>
  <div class="IEHeaderSection">
    <h2 class="IEHeaderSectionTitle">Backup</h2>
    <strong>Last backup: {isDefaultBackupDate ? "—" : lastBackupDate ? moment(lastBackupDate).format("DD MMMM YYYY HH:mm") : "—"}</strong>
    <p>* Importing or exporting settings will reset the last backup date</p>
    <p>* Export your current settings before importing, otherwise you won't be able to revert the changes</p>
    <p>* Settings from older versions of the extension may not be fully compatible</p>
  </div>

  <div class="IESections">
    <div class="IESection">
      <h2>Import Settings</h2>
      
      <div>
        <input
          type="checkbox"
          id="import_pages"
          name="import_pages"
          class="settingsCheckbox"
          bind:checked={importPages}
        />
        <label for="import_pages">Import Pages & Categories</label>
      </div>

      <div>
        <input
          type="checkbox"
          id="import_tileImages"
          name="import_tileImages"
          class="settingsCheckbox"
          bind:checked={importTileImages}
        />
        <label for="import_tileImages">Import Tile Images</label>
      </div>

      <div>
        <input
          type="checkbox"
          id="import_background"
          name="import_background"
          class="settingsCheckbox"
          bind:checked={importBackground}
        />
        <label for="import_background">Import Background</label>
      </div>

      <div>
        <input
          type="checkbox"
          id="import_visuals"
          name="import_visuals"
          class="settingsCheckbox"
          bind:checked={importVisuals}
        />
        <label for="import_visuals">Import Visuals</label>
      </div>

      <div>
        <input
          type="checkbox"
          id="import_searchEngine"
          name="import_searchEngine"
          class="settingsCheckbox"
          bind:checked={importSearchEngine}
        />
        <label for="import_searchEngine">Import Search Engine</label>
      </div>

      <div>
        <input
          type="checkbox"
          id="import_notes"
          name="import_notes"
          class="settingsCheckbox"
          bind:checked={importNotes}
        />
        <label for="import_notes">Import Notes</label>
      </div>

      <small>
        * Importing notes, pages and categories will overwrite your existing ones
      </small>

      <button
        id="importButton"
        on:click={() => {
          fileInput.click();
        }}
      >
        Import
      </button>
      <input
        style="display:none"
        type="file"
        accept=".json"
        on:change={(e) => onFileSelected(e)}
        bind:this={fileInput}
      />
    </div>

    <div class="IESection">
      <h2>Export Settings</h2>
      
      <div>
        <input
          type="checkbox"
          id="export_pages"
          name="export_pages"
          class="settingsCheckbox"
          bind:checked={exportPages}
        />
        <label for="export_pages">Export Pages & Categories</label>
      </div>

      <div>
        <input
          type="checkbox"
          id="export_tileImages"
          name="export_tileImages"
          class="settingsCheckbox"
          bind:checked={exportTileImages}
        />
        <label for="export_tileImages">Export Tile Images</label>
      </div>

      <div>
        <input
          type="checkbox"
          id="export_background"
          name="export_background"
          class="settingsCheckbox"
          bind:checked={exportBackground}
        />
        <label for="export_background">Export Background</label>
      </div>

      <div>
        <input
          type="checkbox"
          id="export_visuals"
          name="export_visuals"
          class="settingsCheckbox"
          bind:checked={exportVisuals}
        />
        <label for="export_visuals">Export Visuals</label>
      </div>

      <div>
        <input
          type="checkbox"
          id="export_searchEngine"
          name="export_searchEngine"
          class="settingsCheckbox"
          bind:checked={exportSearchEngine}
        />
        <label for="export_searchEngine">Export Search Engine</label>
      </div>

      <div>
        <input
          type="checkbox"
          id="export_notes"
          name="export_notes"
          class="settingsCheckbox"
          bind:checked={exportNotes}
        />
        <label for="export_notes">Export Notes</label>
      </div>

      <small>
        * Make sure you aren't storing any sensitive information in your notes before exporting them
      </small>

      <button
        id="exportButton"
        on:click={() => {
          exportData();
        }}
      >
        Export
      </button>
      <!-- svelte-ignore a11y-missing-content -->
      <a id="downloadAnchorElem" style="display:none"></a>
    </div>
  </div>

  {#if importFinishedSuccessfully}
    <div class="IEAlerts">
      <div class="IEAlert IEAlertSuccess">
        <span>Settings imported successfully.</span>
      </div>
      <div class="IEAlert spacer"></div>
    </div>
  {/if}

  {#if importErrors.pages
    || importErrors.tileImages
    || importErrors.background
    || importErrors.visuals
    || importErrors.searchEngine
    || importErrors.notes
  }
    <div class="IEAlerts">
      <div class="IEAlert IEAlertError">
        {#if importErrors.pages}
          <span>There was an error importing pages & categories.</span>
        {/if}
        {#if importErrors.tileImages}
          <span>There was an error importing tile images.</span>
        {/if}
        {#if importErrors.background}
          <span>There was an error importing the background.</span>
        {/if}
        {#if importErrors.visuals}
          <span>There was an error importing visuals.</span>
        {/if}
        {#if importErrors.searchEngine}
          <span>There was an error importing the search engine.</span>
        {/if}
        {#if importErrors.notes}
          <span>There was an error importing notes.</span>
        {/if}
        {#if importErrors.pages && importErrors.background && importErrors.visuals && importErrors.searchEngine && importErrors.notes}
          <span>Please verify that the file has a supported metro-tab-config format.</span>
        {:else}
          <span>All of the other checked options were successfully imported.</span>
        {/if}
      </div>
      <div class="IEAlert spacer"></div>
    </div>
  {/if}
</div>

<style>
  .IEPage {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 32px;
    margin-top: 32px;
  }
  .IEHeaderSection {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
    border: 1px solid lightgray;
    border-radius: 10px;
    padding: 10px 30px 25px 30px;
    flex-grow: 1;
    width: clamp(400px, 55%, 1200px);
    box-sizing: border-box;
  }
  .IEPage.darkModifier .IEHeaderSection {
    border-color: #3a99ff;
  }
  .IEHeaderSection p {
    margin: 0;
  }
  .IEHeaderSectionTitle {
    margin-block-start: 0.4rem;
    margin-block-end: 0.4rem;
  }
  .IESections {
    display: flex;
    justify-content: center;
    gap: 32px;
    width: clamp(400px, 55%, 1200px);
  }
  .IEPage.darkModifier .IESection {
    border-color: #3a99ff;
  }
  .IESection {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
    border: 1px solid lightgray;
    border-radius: 10px;
    padding: 10px 30px 25px 30px;
    flex-grow: 1;
    flex-basis: 50%;
  }
  h2 {
    margin-block-start: 0.4em;
    margin-block-end: 0.6em;
  }
  small {
    margin-top: 0.4em;
    margin-bottom: 0.8em;
    font-size: 0.8em;
    color: gray;
  }
  button {
    margin-top: auto;
    padding: 8px 30px;
    border: 0;
    border-radius: 10px;
    cursor: pointer;
    color: black;
    transition: 0.3s;
  }
  #importButton {
    background-color: #0b1;
    color: white;
  }
  #importButton:hover {
    background-color: #0c2;
  }
  #exportButton {
    background-color: rgb(238, 218, 34);
  }
  #exportButton:hover {
    background-color: rgb(230, 200, 22);
  }
  .IEAlerts {
    display: flex;
    justify-content: center;
    gap: 32px;
    width: clamp(400px, 55%, 1200px);
  }
  .IEAlert {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
    padding: 15px 30px 20px 30px;
    border-radius: 10px;
    flex-grow: 1;
    flex-basis: 50%;
    overflow: hidden;
  }
  .IEAlertError {
    color: rgb(115, 30, 35);
    background-color: #ecc7ca;
    border: 1px solid #d4a5aa;
  }
  .IEAlertSuccess {
    color: rgb(20, 90, 35);
    background-color: #d1eccf;
    border: 1px solid #b5dfb5;
  }
  .IEAlert.spacer {
    visibility: hidden;
  }
  @media screen and (max-width: 1200px) {
    .IEPage, .IESections, .IEAlerts {
      gap: 8px;
    }
    .IEHeaderSection, .IESections, .IEAlerts {
      width: 100%;
    }
  }
  @media screen and (max-width: 600px) {
    .IEPage, .IESections, .IEAlerts {
      flex-direction: column;
    }
  }
</style>
