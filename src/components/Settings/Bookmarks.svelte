<script>
  import { checkWebsite, escapeHTML, getImageNameForLink } from "../../data/tools";
  import BookmarkTreeNode from "./BookmarkTreeNode.svelte";
  import { v4 as uuid } from "uuid";

  export let settingsData;
  export let saveSettings;

  let flatMappedPages = [];

  let isBookmarksApiAvailable;
  let bookmarksPermissionCheckError = false;
  let bookmarksData;
  let convertedBookmarks;

  let conversionMethod = "flatMapPages";
  let excludeExistingPages = true;
  let importCategoryId;
  let optionsChanged = false;

  let convertFinished = false;
  let isConvertedBookmarksEmpty = false;
  let readErrorMessage;
  let convertErrorMessage;
  let importErrorMessage;
  let importSuccessMessage;

  const handleRequestBookmarksPermission = () => {
    try {
      chrome.permissions.request(
        { permissions: ['bookmarks'] },
        (granted) => {
          if (granted) {
            isBookmarksApiAvailable = true;
          }
        }
      );
    } catch {
      bookmarksPermissionCheckError = true;
    }
  }

  const handleReadBookmarks = () => {
    if (!isBookmarksApiAvailable) return;

    // Reset previous import success message
    importSuccessMessage = null;

    try {
      chrome.bookmarks.getTree((bookmarkTreeNodes) => {
        bookmarksData = bookmarkTreeNodes;
      });
      readErrorMessage = null;
    } catch (error) {
      readErrorMessage = "An error occurred while reading bookmarks: " + error.message;
    }
  }

  const handleImport = (event) => {
    if (isConvertedBookmarksEmpty) return;

    try {
      convertedBookmarks.forEach(category => {
        const existingCategory = settingsData.categories.find(cat => cat.name === category.name);
        if (!existingCategory && category.name !== '$_HIDDEN_CATEGORY_$' && category.name !== '$_UNCATEGORIZED_CATEGORY_$') {
          // Add category if at least one element has includeCheckbox true
          if (category.pages.some(page => {
            if (page.isGroup) {
              return page.pages.some(subPage => subPage._includeCheckbox);
            }
            return page._includeCheckbox;
          })) {
            settingsData.categories.push({
              id: category.id,
              name: category.name,
            });
          }
        }

        // Add pages that have includeCheckbox true
        settingsData.pages.push(
          ...category.pages.filter(page => {
            if (page.isGroup) {
              return page.pages.some(subPage => subPage._includeCheckbox);
            }
            return page._includeCheckbox;
          }).map(page => {
            if (page.isGroup) {
              return {
                ...page,
                pages: page.pages.filter(subPage => subPage._includeCheckbox)
              }
            }
            return page;
          }).flatMap(page => {
            // If it's a group and it has more than 40 pages, split it into multiple groups
            if (page.isGroup && page.pages.length > 40) {
              const numberOfGroups = Math.ceil(page.pages.length / 40);
              const groups = [];
              for (let i = 0; i < numberOfGroups; i++) {
                groups.push({
                  ...page,
                  name: `${page.name} (${i + 1})`,
                  pages: page.pages.slice(i * 40, (i + 1) * 40)
                });
              }
              return groups;
            }
            return page;
          })
        );
      });

      saveSettings(settingsData, event);
      importSuccessMessage = "Bookmarks imported successfully!";
      importErrorMessage = null;

      // Reset data
      bookmarksData = null;
      convertedBookmarks = null;
      convertFinished = false;
      excludeExistingPages = true;
      importCategoryId = undefined;
    } catch (error) {
      importErrorMessage = "An error occurred while importing bookmarks: " + error.message;
      importSuccessMessage = null;
    }
  }

  const getPageItem = (url) => {
    let linkToAdd = checkWebsite(url);
    let imageName = getImageNameForLink(linkToAdd);

    return {
      link: escapeHTML(linkToAdd),
      imageName: imageName,
      isActive: true,
      tileImageType: imageName.length > 1 ? 'predefined' : 'none',
      tileName: imageName[0].toUpperCase() + imageName.slice(1),
      backgroundColor: "#3a99ff",
      textColor: "#ffffff",
      _includeCheckbox: true,
    };
  }

  const checkExistingPages = (url) => {
    if (!excludeExistingPages) return false;
    let linkToCheck = url;
    linkToCheck = linkToCheck.replace(/\/+$/, ""); // Remove trailing slashes
    linkToCheck = linkToCheck.replace(/^https?:\/\//, ""); // Remove protocol
    linkToCheck = linkToCheck.replace(/^www\./, ""); // Remove www
    return flatMappedPages.includes(linkToCheck);
  }

  const flatMapPages = () => {
    if (!bookmarksData) return;

    let importCategory = settingsData.categories.find(cat => cat.id === importCategoryId);

    let tempConvertedBookmarks = [{
      id: importCategory ? importCategory.id : uuid(),
      name: importCategory ? importCategory.name : "$_HIDDEN_CATEGORY_$",
      pages: [],
    }];

    const flatMap = (nodes) => {
      for (const node of nodes) {
        if (node.url && node.url !== "data:" && !checkExistingPages(node.url)) {
          tempConvertedBookmarks[0].pages.push({
            ...getPageItem(node.url),
            ...(importCategory ? { categoryId: importCategory.id } : {})
          });
        }
        if (node.children) {
          flatMap(node.children);
        }
      }
    };
    flatMap(bookmarksData);

    convertedBookmarks = tempConvertedBookmarks;
    convertFinished = true;
  }

  const flatMapParentFolders = () => {
    if (!bookmarksData) return;

    let importCategory = settingsData.categories.find(cat => cat.id === importCategoryId);

    let tempConvertedBookmarks = [{
      id: importCategory ? importCategory.id : uuid(),
      name: importCategory ? importCategory.name : "$_HIDDEN_CATEGORY_$",
      pages: [],
    }];

    const flatMap = (nodes, parentFolderName = null) => {
      for (const node of nodes) {
        if (node.url && node.url !== "data:" && !checkExistingPages(node.url)) {
          let pageToAdd = getPageItem(node.url);

          if (parentFolderName) {
            let parentFolder = tempConvertedBookmarks[0].pages.find(page => page.isGroup && page.name === parentFolderName);
            if (!parentFolder) {
              parentFolder = {
                name: parentFolderName,
                isGroup: true,
                isActive: true,
                pages: []
              };
              tempConvertedBookmarks[0].pages.push({
                ...parentFolder,
                ...(importCategory ? { categoryId: importCategory.id } : {})
              });
            }
            parentFolder.pages.push(pageToAdd);
          } else {
            tempConvertedBookmarks[0].pages.push({
              ...pageToAdd,
              ...(importCategory ? { categoryId: importCategory.id } : {})
            });
          }
        }
        if (node.children) {
          flatMap(node.children, node.title);
        }
      }
    };
    flatMap(bookmarksData);

    convertedBookmarks = tempConvertedBookmarks;
    convertFinished = true;
  }

  const flatMapParentFoldersToCategories = () => {
    if (!bookmarksData) return;
  
    let tempConvertedBookmarks = [];
  
    const flatMap = (nodes, parentFolderName = null) => {
      for (const node of nodes) {
        if (node.url && node.url !== "data:" && !checkExistingPages(node.url)) {
          let pageToAdd = getPageItem(node.url)
  
          if (parentFolderName) {
            let category = tempConvertedBookmarks.find(cat => cat.name === parentFolderName);
            let existingCategory = settingsData.categories.find(cat => cat.name === parentFolderName);
            if (!category) {
              category = {
                id: existingCategory ? existingCategory.id : uuid(),
                name: parentFolderName,
                pages: []
              };
              tempConvertedBookmarks.push(category);
            }
            category.pages.push({
              ...pageToAdd,
              categoryId: category.id
            });
          } else {
            let uncategorizedCategory = tempConvertedBookmarks.find(cat => cat.name === '$_HIDDEN_CATEGORY_$');
            if (!uncategorizedCategory) {
              uncategorizedCategory = {
                id: uuid(),
                name: '$_HIDDEN_CATEGORY_$',
                pages: []
              };
              tempConvertedBookmarks.push(uncategorizedCategory);
            }
            uncategorizedCategory.pages.push(pageToAdd);
          }
        }
        if (node.children) {
          flatMap(node.children, node.title);
        }
      }
    };
    flatMap(bookmarksData);
  
    convertedBookmarks = tempConvertedBookmarks;
    convertFinished = true;
  }

  const flatMapFirstLevelFolders = () => {
    if (!bookmarksData) return;

    let importCategory = settingsData.categories.find(cat => cat.id === importCategoryId);

    let tempConvertedBookmarks = [{
      id: importCategory ? importCategory.id : uuid(),
      name: importCategory ? importCategory.name : "$_HIDDEN_CATEGORY_$",
      pages: [],
    }];

    const flatMap = (nodes, level, firstLevelFolderName) => {
      for (const node of nodes) {
        if (node.url && node.url !== "data:" && !checkExistingPages(node.url)) {
          let pageToAdd = getPageItem(node.url)

          if (firstLevelFolderName) {
            let parentFolder = tempConvertedBookmarks[0].pages.find(page => page.isGroup && page.name === firstLevelFolderName);
            if (!parentFolder) {
              parentFolder = {
                name: firstLevelFolderName,
                isGroup: true,
                isActive: true,
                pages: []
              };
              tempConvertedBookmarks[0].pages.push({
                ...parentFolder,
                ...(importCategory ? { categoryId: importCategory.id } : {})
              });
            }
            parentFolder.pages.push(pageToAdd);
          } else {
            tempConvertedBookmarks[0].pages.push({
              ...pageToAdd,
              ...(importCategory ? { categoryId: importCategory.id } : {})
            });
          }
        }
        if (node.children) {
          flatMap(node.children, level + 1, level === 2 ? node.title : firstLevelFolderName);
        }
      }
    };
    flatMap(bookmarksData, 0);

    tempConvertedBookmarks[0].pages.sort((a, b) => {
      if (a.isGroup && !b.isGroup) return -1;
      if (!a.isGroup && b.isGroup) return 1;
      return 0;
    });

    convertedBookmarks = tempConvertedBookmarks;
    convertFinished = true;
  }

  const flatMapFirstLevelFoldersToCategories = () => {
    if (!bookmarksData) return;

    let tempConvertedBookmarks = [];

    const flatMap = (nodes, level, firstLevelFolderName) => {
      for (const node of nodes) {
        if (node.url && node.url !== "data:" && !checkExistingPages(node.url)) {
          let pageToAdd = getPageItem(node.url)

          if (firstLevelFolderName) {
            let category = tempConvertedBookmarks.find(cat => cat.name === firstLevelFolderName);
            let existingCategory = settingsData.categories.find(cat => cat.name === firstLevelFolderName);
            if (!category) {
              category = {
                id: existingCategory ? existingCategory.id : uuid(),
                name: firstLevelFolderName,
                pages: []
              };
              tempConvertedBookmarks.push(category);
            }
            category.pages.push({
              ...pageToAdd,
              categoryId: category.id
            });
          } else {
            let uncategorizedCategory = tempConvertedBookmarks.find(cat => cat.name === '$_UNCATEGORIZED_CATEGORY_$');
            if (!uncategorizedCategory) {
              uncategorizedCategory = {
                id: uuid(),
                name: '$_UNCATEGORIZED_CATEGORY_$',
                pages: []
              };
              tempConvertedBookmarks.push(uncategorizedCategory);
            }
            uncategorizedCategory.pages.push(pageToAdd);
          }
        }
        if (node.children) {
          flatMap(node.children, level + 1, level === 2 ? node.title : firstLevelFolderName);
        }
      }
    };
    flatMap(bookmarksData, 0);

    tempConvertedBookmarks.sort((a, b) => {
      if (a.name === '$_UNCATEGORIZED_CATEGORY_$') return 1;
      if (b.name === '$_UNCATEGORIZED_CATEGORY_$') return -1;
      return 0;
    });

    convertedBookmarks = tempConvertedBookmarks;
    convertFinished = true;
  }

  const flatMapFirstLevelFoldersToCategoriesAndMapParentFolders = () => {
    if (!bookmarksData) return;

    let tempConvertedBookmarks = [];

    const flatMap = (nodes, level, firstLevelFolderName, parentFolderName) => {
      for (const node of nodes) {
        if (node.url && node.url !== "data:" && !checkExistingPages(node.url)) {
          let pageToAdd = getPageItem(node.url)

          if (firstLevelFolderName) {
            let category = tempConvertedBookmarks.find(cat => cat.name === firstLevelFolderName);
            let existingCategory = settingsData.categories.find(cat => cat.name === firstLevelFolderName);
            if (!category) {
              category = {
                id: existingCategory ? existingCategory.id : uuid(),
                name: firstLevelFolderName,
                pages: []
              };
              tempConvertedBookmarks.push(category);
            }

            if (parentFolderName && parentFolderName !== firstLevelFolderName) {
              let parentFolder = category.pages.find(page => page.isGroup && page.name === parentFolderName);
              if (!parentFolder) {
                parentFolder = {
                  name: parentFolderName,
                  categoryId: category.id,
                  isGroup: true,
                  isActive: true,
                  pages: []
                };
                category.pages.push(parentFolder);
              }

              parentFolder.pages.push(pageToAdd);
            } else {
              category.pages.push({
                ...pageToAdd,
                categoryId: category.id
              });
            }
          } else {
            let uncategorizedCategory = tempConvertedBookmarks.find(cat => cat.name === '$_UNCATEGORIZED_CATEGORY_$');
            if (!uncategorizedCategory) {
              uncategorizedCategory = {
                id: uuid(),
                name: '$_UNCATEGORIZED_CATEGORY_$',
                pages: []
              };
              tempConvertedBookmarks.push(uncategorizedCategory);
            }
            uncategorizedCategory.pages.push(pageToAdd);
          }
        }
        if (node.children) {
          flatMap(node.children, level + 1, level === 2 ? node.title : firstLevelFolderName, node.title);
        }
      }
    };
    flatMap(bookmarksData, 0);

    tempConvertedBookmarks.sort((a, b) => {
      if (a.name === '$_UNCATEGORIZED_CATEGORY_$') return 1;
      if (b.name === '$_UNCATEGORIZED_CATEGORY_$') return -1;
      return 0;
    });

    convertedBookmarks = tempConvertedBookmarks;
    convertFinished = true;
  }

  $: {
    // Check if bookmarks permission is granted
    try {
      chrome.permissions.contains(
        { permissions: ['bookmarks'] },
        (result) => {
          isBookmarksApiAvailable = result;
        }
      );
    } catch {
      bookmarksPermissionCheckError = true;
    }
  }

  $: {
    // Flat map existing pages - reactive to settingsData.pages changes (after import)
    flatMappedPages = settingsData.pages.flatMap(page => {
      if (page.link) {
        let link = page.link;
        link = link.replace(/\/+$/, ""); // Remove trailing slashes
        link = link.replace(/^https?:\/\//, ""); // Remove protocol
        link = link.replace(/^www\./, ""); // Remove www
        return link;
      }
      if (page.isGroup && page.pages && page.pages.length > 0) {
        return page.pages.map(subPage => {
          if (subPage.link) {
            let link = subPage.link;
            link = link.replace(/\/+$/, ""); // Remove trailing slashes
            link = link.replace(/^https?:\/\//, ""); // Remove protocol
            link = link.replace(/^www\./, ""); // Remove www
            return link;
          }
          return [];
        });
      }
    });
  }

  $: isConvertedBookmarksEmpty = !convertedBookmarks || convertedBookmarks.length === 0 || (convertedBookmarks.length === 1 && convertedBookmarks[0].pages.length === 0);
</script>

<div id="settingsBookmarks" class:darkModifier={settingsData.darkMode}>
  <div class="bookmarksHeaderCard">
    <h2 class="bookmarksHeaderCardTitle">
      Import bookmarks
      {#if isBookmarksApiAvailable}
        <span class="permissionChip">
          <i class="fas fa-check" />
          Permission granted
        </span>
      {/if}
    </h2>
    {#if bookmarksPermissionCheckError}
      <p style="color: red;">An error occurred while checking bookmarks permission. This feature is not available for your browser.</p>
    {:else}
      {#if !isBookmarksApiAvailable}
        <p>The extension needs additional permissions to access your bookmarks.</p>
        <p>Please grant the necessary permissions to use this feature by clicking "Allow" in the popup that appears after clicking the button below.</p>

        <button class="accessButton" on:click={handleRequestBookmarksPermission}>
          Grant access
        </button>
      {/if}

      {#if isBookmarksApiAvailable}
        <p>To import your bookmarks, click on the read button and then select a conversion method.</p>
        <p>After converting the bookmarks into a format supported by the extension, you can select which ones to import.</p>

        <button class="readButton" on:click={handleReadBookmarks}>
          Read bookmarks
        </button>

        {#if importSuccessMessage}
          <p class="alertSuccess">{importSuccessMessage}</p>
        {/if}

        {#if readErrorMessage}
          <p class="alertDanger">{readErrorMessage}</p>
        {/if}
      {/if}
    {/if}
  </div>

  {#if bookmarksData}
    <div class="bookmarksControlsCard">
      <h2 class="bookmarksControlsCardTitle">Conversion method</h2>
      <div class="bookmarksControlsCardContent">
        <div>
          <input
            type="radio"
            name="conversionMethod"
            id="flatMapPages"
            value="flatMapPages"
            bind:group={conversionMethod}
            on:change={() => optionsChanged = true}
          />
          <label for="flatMapPages">
            Convert to pages
          </label>
        </div>

        <div>
          <input
            type="radio"
            name="conversionMethod"
            id="flatMapParentFolders"
            value="flatMapParentFolders"
            bind:group={conversionMethod}
            on:change={() => optionsChanged = true}
          />
          <label for="flatMapParentFolders">
            Convert to groups from parent folders
          </label>
        </div>

        <div>
          <input
            type="radio"
            name="conversionMethod"
            id="flatMapParentFoldersToCategories"
            value="flatMapParentFoldersToCategories"
            bind:group={conversionMethod}
            on:change={() => optionsChanged = true}
          />
          <label for="flatMapParentFoldersToCategories">
            Convert to categories from parent folders
          </label>
        </div>

        <div>
          <input
            type="radio"
            name="conversionMethod"
            id="flatMapFirstLevelFolders"
            value="flatMapFirstLevelFolders"
            bind:group={conversionMethod}
            on:change={() => optionsChanged = true}
          />
          <label for="flatMapFirstLevelFolders">
            Convert to groups from first-level folders
          </label>
        </div>

        <div>
          <input
            type="radio"
            name="conversionMethod"
            id="flatMapFirstLevelFoldersToCategories"
            value="flatMapFirstLevelFoldersToCategories"
            bind:group={conversionMethod}
            on:change={() => optionsChanged = true}
          />
          <label for="flatMapFirstLevelFoldersToCategories">
            Convert to categories from first-level folders
          </label>
        </div>

        <div>
          <input
            type="radio"
            name="conversionMethod"
            id="flatMapFirstLevelFoldersToCategoriesAndMapParentFolders"
            value="flatMapFirstLevelFoldersToCategoriesAndMapParentFolders"
            bind:group={conversionMethod}
            on:change={() => optionsChanged = true}
          />
          <label for="flatMapFirstLevelFoldersToCategoriesAndMapParentFolders">
            Convert to categories from first-level folders and groups from parent folders
          </label>
        </div>

        <div>
          <input
            type="checkbox"
            name="excludeExistingPages"
            id="excludeExistingPages"
            bind:checked={excludeExistingPages}
            on:change={() => optionsChanged = true}
          />
          <label for="excludeExistingPages">
            Exclude existing pages
          </label>
        </div>

        {#if settingsData.categories.length > 0}
          <div class="importCategorySelectGroup">
            <label
              for="importCategorySelect"
              class:disabledLabel={conversionMethod === "flatMapParentFoldersToCategories" || conversionMethod === "flatMapFirstLevelFoldersToCategories" || conversionMethod === "flatMapFirstLevelFoldersToCategoriesAndMapParentFolders"}
            >
              Import into category:
            </label>
            <select
              name="importCategorySelect"
              id="importCategorySelect"
              bind:value={importCategoryId}
              disabled={conversionMethod === "flatMapParentFoldersToCategories" || conversionMethod === "flatMapFirstLevelFoldersToCategories" || conversionMethod === "flatMapFirstLevelFoldersToCategoriesAndMapParentFolders"}
              on:change={() => optionsChanged = true}
            >
              <option value={undefined}>Uncategorized</option>
              {#each settingsData.categories as category}
                <option value={category.id}>{category.name}</option>
              {/each}
            </select>
          </div>
        {/if}

        <div class="bookmarksControlsCardButtons">
          <button
            class="convertButton"
            on:click={() => {
              try {
                if (conversionMethod === "flatMapPages") {
                  flatMapPages();
                } else if (conversionMethod === "flatMapParentFolders") {
                  flatMapParentFolders();
                } else if (conversionMethod === "flatMapParentFoldersToCategories") {
                  flatMapParentFoldersToCategories();
                } else if (conversionMethod === "flatMapFirstLevelFolders") {
                  flatMapFirstLevelFolders();
                } else if (conversionMethod === "flatMapFirstLevelFoldersToCategories") {
                  flatMapFirstLevelFoldersToCategories();
                } else if (conversionMethod === "flatMapFirstLevelFoldersToCategoriesAndMapParentFolders") {
                  flatMapFirstLevelFoldersToCategoriesAndMapParentFolders();
                }
                convertErrorMessage = null;
                optionsChanged = false;
              } catch (error) {
                convertErrorMessage = "An error occurred while converting bookmarks: " + error.message;
                convertFinished = false;
              }
            }}
          >
            Convert
          </button>

          <button
            class="importButton"
            on:click={(e) => handleImport(e)}
            disabled={isConvertedBookmarksEmpty}
          >
            Import
          </button>

          {#if convertFinished && optionsChanged}
            <p>Options changed. Convert again to apply changes.</p>
          {/if}
        </div>

        {#if importErrorMessage}
          <p class="alertDanger">{importErrorMessage}</p>
        {/if}
      </div>
    </div>

    <div class="bookmarksCards">
      <div class="bookmarksDataCard">
        <h2 class="bookmarksDataCardTitle">Bookmarks Data</h2>
        <div class="bookmarksDataCardContent">
          <div class="legend">
            <div class="legendTitle">
              <p>Legend:</p>
            </div>
            <div class="legendItem">
              <i class="fas fa-folder" />
              <p>Folder</p>
            </div>
          </div>
          {#if bookmarksData[0] && bookmarksData[0].children}
            {#each bookmarksData[0].children as node}
              <BookmarkTreeNode {node} level={0} />
            {/each}
          {/if}
        </div>
      </div>

      <div class="bookmarksConvertedCard">
        <h2 class="bookmarksConvertedCardTitle">Converted Bookmarks</h2>
        <div class="bookmarksConvertedCardContent">
          <div class="legend">
            <div class="legendTitle">
              <p>Legend:</p>
            </div>
            <div class="legendItem">
              <i class="fas fa-layer-group" />
              <p>Category</p>
            </div>
            <div class="legendItem">
              <i class="fas fa-folder" />
              <p>Group</p>
            </div>
          </div>

          {#if convertFinished && isConvertedBookmarksEmpty}
            <p>No bookmarks to import based on the selected conversion method and options.</p>
          {/if}

          {#if convertErrorMessage}
            <p class="alertDanger">{convertErrorMessage}</p>
          {/if}

          {#if convertedBookmarks}
            {#each convertedBookmarks as category}
              <div class="convertedCategory" class:convertedCategoryHidden={category.name === '$_HIDDEN_CATEGORY_$'}>
                {#if category.name !== '$_HIDDEN_CATEGORY_$' && category.pages.length > 0}
                  <div class="convertedCategoryHead">
                    <i class="fas fa-layer-group" />
                    <input
                      type="checkbox"
                      indeterminate={category.pages.some(page => (page.isGroup ? page.pages.some(subPage => subPage._includeCheckbox) : page._includeCheckbox)) && !category.pages.every(page => (page.isGroup ? page.pages.every(subPage => subPage._includeCheckbox) : page._includeCheckbox))}
                      checked={category.pages.every(page => (page.isGroup ? page.pages.every(subPage => subPage._includeCheckbox) : page._includeCheckbox))}
                      on:change={(e) => {
                        category.pages.forEach(page => {
                          if (page.isGroup) {
                            page.pages.forEach(subPage => subPage._includeCheckbox = e.target.checked);
                          } else {
                            page._includeCheckbox = e.target.checked;
                          }
                        });
                        category.pages = [...category.pages]; // Trigger reactivity
                      }}
                    />
                    <p>
                      {#if category.name === '$_UNCATEGORIZED_CATEGORY_$'}
                        Uncategorized
                      {:else}
                        {category.name}
                      {/if}
                    </p>
                  </div>
                {/if}
                {#each category.pages as page}
                  {#if page.isGroup}
                    <div class="convertedGroup" class:convertedItemSpacing={category.name !== '$_HIDDEN_CATEGORY_$'}>
                      <div class="convertedGroupHead">
                        <i class="fas fa-folder" />
                        <input
                          type="checkbox"
                          indeterminate={page.pages.some(subPage => subPage._includeCheckbox) && !page.pages.every(subPage => subPage._includeCheckbox)}
                          checked={page.pages.every(subPage => subPage._includeCheckbox)}
                          on:change={(e) => {
                            page.pages.forEach(subPage => subPage._includeCheckbox = e.target.checked);
                            page.pages = [...page.pages]; // Trigger reactivity
                          }}
                        />
                        <p>
                          {page.name}
                        </p>
                      </div>
                      {#if page.pages.length > 40}
                        <div class="convertedItemSpacing">
                          Maximum group size exceeded - on import it will be split into multiple groups
                        </div>
                      {/if}
                      {#each page.pages as subPage}
                        <div class="convertedSubPage convertedItemSpacing">
                          <input
                            type="checkbox"
                            bind:checked={subPage._includeCheckbox}
                          />
                          <p>{subPage.link}</p>
                        </div>
                      {/each}
                    </div>
                  {:else}
                    <div class="convertedPage" class:convertedItemSpacing={category.name !== '$_HIDDEN_CATEGORY_$'}>
                      <input
                        type="checkbox"
                        bind:checked={page._includeCheckbox}
                      />
                      <p>{page.link}</p>
                    </div>
                  {/if}
                {/each}
              </div>
            {/each}
          {/if}
        </div>
      </div>
    </div>
  {/if}
</div>

<style>
  h2 {
    margin-block-start: 0.2em;
    margin-block-end: 0.4em;
  }
  p {
    margin-block-start: 0.2em;
    margin-block-end: 0.2em;
  }
  #settingsBookmarks {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
    gap: 12px;
  }
  .permissionChip {
    font-size: 12px;
    margin-top: 2px;
    padding: 2px 8px 4px 8px;
    border-radius: 5px;
    margin: 0;
    color: rgb(20, 90, 35);
    background-color: #d1eccf;
    border: 1px solid #b5dfb5;
  }
  .bookmarksHeaderCardTitle {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .bookmarksHeaderCard,
  .bookmarksControlsCard,
  .bookmarksDataCard,
  .bookmarksConvertedCard {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    border-radius: 10px;
    padding: 10px 30px 20px 30px;
    flex-grow: 1;
    width: 100%;
    box-sizing: border-box;
    box-shadow: var(--shadow-small-strong);
    background-color: var(--settings-background-secondary-color);
  }
  #settingsBookmarks.darkModifier .bookmarksHeaderCard,
  #settingsBookmarks.darkModifier .bookmarksControlsCard,
  #settingsBookmarks.darkModifier .bookmarksDataCard,
  #settingsBookmarks.darkModifier .bookmarksConvertedCard {
    background-color: var(--settings-background-secondary-color-dark);
    border: 1px solid var(--primary-color);
  }
  .bookmarksCards {
    display: flex;
    gap: 12px;
    width: 100%;
  }
  .bookmarksDataCard,
  .bookmarksConvertedCard {
    flex-basis: 50%;
    max-width: calc(50% - 6px);
  }
  .bookmarksDataCardContent,
  .bookmarksConvertedCardContent {
    max-width: 100%;
  }
  .bookmarksControlsCardContent {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  .bookmarksControlsCardButtons {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .bookmarksControlsCardButtons p {
    margin-top: 10px;
    font-size: 0.8em;
  }
  .importCategorySelectGroup {
    margin-top: 4px;
  }
  .disabledLabel {
    opacity: 0.6;
  }
  .accessButton,
  .readButton,
  .convertButton,
  .importButton {
    margin-top: 8px;
    padding: 8px 20px;
    border: 0;
    border-radius: 10px;
    cursor: pointer;
    transition: 0.3s;
  }
  .accessButton,
  .readButton,
  .convertButton {
    color: var(--primary-color-text);
    background-color: var(--primary-color);
  }
  .importButton {
    color: var(--success-color-text);
    background-color: var(--success-color);
  }
  .accessButton:hover,
  .readButton:hover,
  .convertButton:hover {
    background-color: var(--primary-color-hover);
  }
  .importButton:hover {
    background-color: var(--success-color-hover);
  }
  .legend {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
    margin-bottom: 8px;
  }
  .legendItem {
    display: flex;
    align-items: center;
    gap: 4px;
    margin-left: 8px;
    margin-right: 8px;
  }
  .convertedPage p,
  .convertedSubPage p,
  .convertedCategory p,
  .convertedGroup p {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .convertedPage,
  .convertedSubPage,
  .convertedCategoryHead,
  .convertedGroupHead {
    display: flex;
    align-items: center;
    gap: 2px;
  }
  .convertedCategory,
  .convertedGroup {
    position: relative;
  }
  .convertedCategory:not(.convertedCategoryHidden):before,
  .convertedGroup:before {
    content: "";
    position: absolute;
    left: 7px;
    top: 24px;
    bottom: 0;
    width: 1px;
    background-color: rgba(0, 0, 0, 0.15);
  }
  .convertedItemSpacing {
    margin-left: 18px;
  }
  .alertDanger,
  .alertSuccess {
    padding: 12px 16px;
    border-radius: 10px;
    margin: 0;
  }
  .alertDanger {
    color: rgb(115, 30, 35);
    background-color: #ecc7ca;
    border: 1px solid #d4a5aa;
  }
  .alertSuccess {
    color: rgb(20, 90, 35);
    background-color: #d1eccf;
    border: 1px solid #b5dfb5;
  }
  .bookmarksHeaderCard .alertDanger,
  .bookmarksHeaderCard .alertSuccess {
    margin-top: 8px;
  }
</style>
