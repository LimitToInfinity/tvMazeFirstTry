import {
    APP_STATE,
    displayShows
} from "./index.js";

export class WebNetworkSelector {
    constructor() {
        this.isAllNetworks = true;

        this.selectedWebNetworks = new Set();
        
        this.webNetworksContainer = document
            .querySelector(".web-networks");
        this.webNetworksSearch = this.webNetworksContainer
            .querySelector("input");
        this.webNetworksList = this.webNetworksContainer
            .querySelector("datalist");
        
        this.webNetworksSearch
            .addEventListener("change", this.handleWebNetwork);
        this.webNetworksSearch
            .addEventListener("click", this.clearText);
        this.webNetworksSearch
            .addEventListener("blur", this.clearText);
    }

    handleWebNetwork = (event) => {
        const { value } = event.target;

        const selectedWebNetwork =
            document.querySelector(
                `option[value="${value}"]`
            );

        switch (true) {
            case value !== "All networks":
                selectedWebNetwork.classList.toggle("selected");

                this.selectedWebNetworks.has(value)
                    ? this.selectedWebNetworks.delete(value)
                    : this.selectedWebNetworks.add(value);
                
            default:
                this.filterByWebNetwork(event);
                break;
        }
    }

    clearText = (event) => {
        event.target.value = "";
    }

    filterByWebNetwork = (event) => {
        APP_STATE.setPageNumber(1);
        APP_STATE.pages.displayPagesView();
    
        const selectedWebNetwork = event ? event.target.value : undefined;
    
        if (selectedWebNetwork === "All networks") {
            this.selectedWebNetworks.clear();
            this.isAllNetworks = true;
        } else {
            this.isAllNetworks = false;
        }

        APP_STATE.setFilteredShows(
            this.filterByWebNetworks(
                APP_STATE.genreSelector.filterByGenres(
                    APP_STATE.searchBar.filterByName(
                        APP_STATE.allShows,
                        APP_STATE.searchBar.element.value
                    )
                )
            )
        );

        displayShows(APP_STATE.filteredShows);
    }

    filterByWebNetworks = (shows) => {
        console.log(this.isAllNetworks);
        return this.isAllNetworks
            ? shows
            : shows.filter(this.showHasSelectedWebNetwork);
    }

    showHasSelectedWebNetwork = (show) => {
        return show.webChannel
            ? this.selectedWebNetworks.has(show.webChannel.name)
            : false;
    }
    
    setWebNetworkOptions = () => {
        this.removePreviousWebNetworkOptions();
    
        Array.from(this.selectedWebNetworks)
            .forEach(this.createWebNetworkOption);
        Array.from(APP_STATE.webNetworks)
            .filter(webNetwork => !this.selectedWebNetworks.has(webNetwork))
            .sort()
            .forEach(this.createWebNetworkOption);
    }

    removePreviousWebNetworkOptions = () => {
        const allWebNetworks = Array.from(
            this.webNetworksList.querySelectorAll("option")
        );
        const previousWebNetworks = allWebNetworks.filter(webNetwork => {
            return webNetwork.classList.contains("dynamic-web-network");
        });
    
        previousWebNetworks.forEach(option => option.remove());
    } 
    
    createWebNetworkOption = (webNetwork) => {
        const option = document.createElement("option");
        option.classList.add("web-network");
        option.classList.add("dynamic-web-network");
        option.textContent = webNetwork;
        option.value = webNetwork;
        if (this.selectedWebNetworks.has(webNetwork)) {
            option.classList.add("selected");
        }
        
        this.webNetworksList.append(option);
    }
}