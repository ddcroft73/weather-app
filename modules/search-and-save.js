/**
 * a drop down component, sort of.. I want to learn either Web Components and\or react
 * to make things like this more often.
 *
 * Allows the user to both enter and select saved locations. The premise being the ability to
 * quickly check the weather in multiple locations.
 * 
 * I know now this is not how this is done, but its not broke and maybe when I learn how I;ll fix it.
 * If nothing else it will be a nice look back at my progress.
 */

import { getForecastFromLocation } from "./weather-api.js";

export class SearchAndSave {
    constructor() {
        // Psuedo Component State
        this.state = {
            menuVisible: false,
            save: false,
            menuItems: [],
            currentItem: null,
        };

        // DOM
        this.searchButton = document.querySelector(".button");
        this.textBox = document.querySelector("#text");
        this.expandButton = document.querySelector(".expand");
        this.menu = document.querySelector(".menu");
        this.saveCheck = document.querySelector("#checkbox");
        this.component = document.querySelector(".component");
        this.clearButton = document.querySelector("#delete");
        this.saveToolTip = document.querySelector("#search-and-save-tip");

        this.textBox.addEventListener("click", () => {
            this.viewMenu(false);
        });
        this.expandButton.addEventListener("click", () => {
            this.viewMenu(true);
        });
        this.menu.addEventListener("click", () => {
            this.viewMenu(false);
        });

        this.saveCheck.addEventListener("click", () => {
            let checked = document.getElementById("checkbox").checked;
            if (checked) { 
                this.state.save = true;
                this.showTip(this.saveToolTip, 1);
            } else {
                this.state.save = false;
                this.showTip(this.saveToolTip, 0);
            }
        });

        // show the clear button when needed
        this.textBox.addEventListener("keydown", (e) => {
            
            if (e.key ==='ArrowDown') {
                this.viewMenu(true);
            }
            if(e.key === 'Enter') {
                if (this.textBox.value !== "") {
                    const click = new Event('click');
                    this.searchButton.dispatchEvent(click);
                }
            }

        });

        this.searchButton.addEventListener("click", () => {
            const newItem = this.textBox.value;
            this.viewMenu(false);

            if (newItem !== "") {
                // are we saving this?
                if (this.state.save) {

                    const exists = this.itemExists(newItem);
                    if (!exists) {
                        // add the input to the menuItems array.
                        const itemObj = this.addNewItem(newItem);
                        this.addToMenu(itemObj, itemObj.itemID); 
                    }
                }

                // Turn over the location to be searched...
                this.state.currentItem = newItem;
            } else {
                alert("Enter a location to search.");
            }
        });

        this.clearButton.addEventListener("click", () => {
            this.textBox.value = "";
            //this.showClearButton(false);

        });

        // hide menu when clicked outside component
        document.addEventListener("click", (e) => {
            let targetEl = e.target; // clicked element
            do {
                if (targetEl == this.component) {
                    return;
                }
                // Go up the DOM
                targetEl = targetEl.parentNode;
            } while (targetEl);

            this.viewMenu(false);
        });
    }

    // Methods //
// This is unacceptable. 
// create a better re-usable tooltip method. 
// This will be the start of a Custom element
    showTip = (element, save) => {
        // will show a tooltip for a few seconds.

        element.style.display = "inline-block";        
        element.innerHTML = text;        
        if (save) {
            element.innerHTML = "Save location";
            element.style.width = 120 + 'px';
        } else {
            element.innerHTML = "Don't Save";
            element.style.width = 80 +'px';
        }
        

        setTimeout(() => {
            element.style.display = "none";
        }, "1000");
    };

    itemExists = (itemText) => {
        for (let i = 0; i < this.state.menuItems.length; i++) {
            if (
                this.state.menuItems[i].text.toLowerCase() ===
                itemText.toLowerCase()
            ) {
                return true;
            }
        }
        return false;
    };

    showClearButton = (show) => {
        return show
            ? (this.clearButton.style = "visibility: visible;")
            : (this.clearButton.style = "visibility: hidden;");
    };

    // show or hide the menu.
    viewMenu = (view) => {
        if (view) {
            this.menu.style = "visibility: visible;";
            this.state.menuVisible = true;
        } else {
            this.menu.style = "visibility: hidden;";
            this.state.menuVisible = false;
        }
    };

    // loop throught the IDS and return the corresponding text
    getItemText = (itemID) => {
        for (let i = 0; this.state.menuItems.length; i++) {
            if (itemID === this.state.menuItems[i].itemID) {
                return this.state.menuItems[i].text;
            }
        }
    };

    // remove this item from the menu and from storage.
    removeItem = (itemID) => {
        const getItemIndex = (array, id) => {
            for (let i = 0; i < array.length; i++) {
                if (array[i].itemID == id) {
                    return i;
                }
            }
            return -1;
        };
        const removeFromDOM = (id) => {
            const menuItems = document.querySelectorAll(".item-container");
            const container = document.querySelector(".menu");
            let thisID = null;

            for (let i = 0; i < menuItems.length; i++) {
                // slice off the id # after "item-"
                thisID = menuItems[i].getAttribute("id").split("-")[2];
                if (thisID == id) {
                    container.removeChild(menuItems[i]);
                }
            }
        };
        const removeFromStorage = (index) => {
            if (index != -1) {
                this.state.menuItems.splice(index, 1);

                localStorage.setItem(
                    "searches",
                    JSON.stringify(this.state.menuItems)
                );
            }
        };

        removeFromDOM(itemID);
        const itemIndex = getItemIndex(this.state.menuItems, itemID);
        removeFromStorage(itemIndex);
    };

    // listen for the clicks on both the item and the delete Icon and
    // handle accordingly
    bindItemToDOM = (itemID) => {
        const item = document.querySelector("#item-" + itemID);
        const deleteItem = document.querySelector("#close-" + itemID);

        item.addEventListener("click", () => {
            this.state.currentItem = this.getItemText(itemID);
            this.textBox.value = this.state.currentItem;
            this.showClearButton(true);

            // conduct a search
            getForecastFromLocation(this.state.currentItem);
        });
        deleteItem.addEventListener("click", () => {

            // remove this menuitem from the menu and from storage.
            this.removeItem(itemID);
        });

        item.addEventListener("mouseover", () => {
            item.style =
                "color: white; background-color: rgba(27, 53, 92, .9);";
            deleteItem.style =
                "color: rgba(232, 10, 10, 0.9);  background-color: rgba(27, 53, 92, .9);";
        });

        item.addEventListener("mouseout", () => {
            item.style =
                "color: black; background-color: rgba(35, 31, 22, .1);";
            deleteItem.style =
                "color: black;  background-color: rgba(35, 31, 22, .1);";
        });

        // Display all previoulsy saved locations
    };

    // add the input to the menu, one item at a time. Decide if using the truncated name
    // or the name as entered.    

    addToMenu = (inputObj, itemID) => {
        const addElement = (
            tag,
            parent,
            {
                className = null,
                idName = null,
                src = null,
                width = null,
                content = null,
            } = {}
        ) => {
            const div = document.createElement(tag);
            if (idName != null) div.id = idName;
            if (className != null) div.className = className;
            if (src != null) div.src = src;
            if (width != null) div.width = width;
            if (content != null) div.innerHTML = content;

            parent.appendChild(div);
            return div;
        };
        const generateItem = (itemObj, itemID) => {
            // is this name too long to display it all?
            const displayText =
                itemObj.truncatedName === null
                    ? itemObj.text
                    : itemObj.truncatedName;

            // add the item container
            const newItemContainer = addElement("div", this.menu, {
                className: "item-container",
                idName: "item-container-" + itemID,
            });
            // add the item
            addElement("div", newItemContainer, {
                className: "item",
                idName: "item-" + itemID,
                content: displayText,
            });
            // add the item delete button
            addElement("div", newItemContainer, {
                className: "close",
                idName: "close-" + itemID,
                content: "&#x2612;",
            });
        };

        generateItem(inputObj, itemID);
        this.bindItemToDOM(itemID);
    };

    // populate the menu from storage
    loadMenu = (menuItems) => {
        for (let i = 0; i < menuItems.length; i++) {
            this.addToMenu(menuItems[i], menuItems[i].itemID);
        }

        this.textBox.focus()
    };

    // add the item as on object with the ID to find it by, if the location name
    // entered is > 20 chars, then truncate a copy of the name to be used
    // in the menu later
    addNewItem = (itemText) => {
        const getCurrIDS = () => {
            // gets all the IDs from the items in storage
            let returnArray = [];
            for (let i = 0; i < this.state.menuItems.length; i++) {
                returnArray.push(this.state.menuItems[i].itemID);
            }
            return returnArray;
        };

        const getUniqueID = (knownIDs) => {
            let idExists = true;
            let newID = null;

            while (idExists) {
                newID = Math.floor(Math.random() * 300) + 1;
                // if this id doesnt exist
                if (knownIDs.indexOf(newID) === -1) {
                    idExists = false;
                }
            }
            return newID;
        };

        // returns a shortened name if its longer than maxLength
        const truncName = (text) => {
            const maxLen = 25;
            console.log(text.length >= maxLen)
            return text.length >= maxLen ? text.slice(0, maxLen) + "..." : null;
        };

        // get all known IDs
        const currIDs = getCurrIDS();
        const newID = getUniqueID(currIDs);

        // prepare the data to be saved
        let itemObj = {
            text: itemText,
            itemID: newID,
            truncatedName: truncName(itemText),
        };
        // get whats already there , if anything and add to it
        this.state.menuItems = localStorage.getItem("searches")
            ? JSON.parse(localStorage.getItem("searches"))
            : [];
        this.state.menuItems.push(itemObj);

        localStorage.setItem("searches", JSON.stringify(this.state.menuItems));

        return itemObj;
    };

    // loads searched objects fron localStorage
    getSearches = () => {
        this.state.menuItems = localStorage.getItem("searches")
            ? JSON.parse(localStorage.getItem("searches"))
            : [];
        this.state.totalItems = this.state.menuItems.length;
        return this.state.menuItems;
    };

}


