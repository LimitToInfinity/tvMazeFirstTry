import { APP_STATE } from "./index.js";

export class WebNetworkSelector {
    constructor() {
        this.selectedWebNetwork = undefined;

        this.webNetworksContainer = document
            .querySelector(".web-networks-container");
        this.webNetworksSearch = this.webNetworksContainer
            .querySelector("input");
        this.label = this.webNetworksSearch.labels[0];
        this.webNetworksList = this.webNetworksContainer
            .querySelector("datalist");

        this.addShrinkClass = this.addShrinkClass.bind(this);
        this.removeShrinkClass = this.removeShrinkClass.bind(this);
        this.handleWebNetworks = this.handleWebNetworks.bind(this);
        this.showHasSelectedWebNetwork =
            this.showHasSelectedWebNetwork.bind(this);
        this.createWebNetworkOption =
            this.createWebNetworkOption.bind(this);
        
        this.webNetworksSearch
            .addEventListener("focus", this.addShrinkClass);
        this.webNetworksSearch
            .addEventListener("blur", this.removeShrinkClass);
        this.webNetworksSearch
            .addEventListener("change", this.handleWebNetworks);
        this.webNetworksSearch
            .addEventListener("click", this.clearText);
    }
        
    addShrinkClass() {
        this.label.classList.remove("shrink-uncolored");
        this.label.classList.add("shrink-colored");
    }
    
    removeShrinkClass() {
        if (!this.webNetworksSearch.value) {
            this.label.classList.remove("shrink-colored");
            this.label.classList.remove("shrink-uncolored");
        } else {
            this.label.classList.remove("shrink-colored");
            this.label.classList.add("shrink-uncolored");
        }
    }

    handleWebNetworks(event) {
        const selectedWebNetwork = event.target.value.toLowerCase();

        const selectedWebNetworkOption = document.querySelector(
            `option[data-web-network="${selectedWebNetwork}"]`
        );

        switch (true) {
            case !selectedWebNetworkOption:
                break;
            case selectedWebNetwork !== "all networks":
                this.selectedWebNetwork = selectedWebNetwork;

            default:
                this.handleSelectedWebNetwork(selectedWebNetwork);
                break;
        }
    }

    clearText(event) {
        event.target.value = "";
    }

    handleSelectedWebNetwork(selectedWebNetwork) {
        if (selectedWebNetwork === "all networks") {
            this.selectedWebNetwork = undefined;
        }

        APP_STATE.setAndDisplayFilteredShows();
    }

    filterByWebNetwork(shows) {
        return this.selectedWebNetwork
            ? shows.filter(this.showHasSelectedWebNetwork)
            : shows;
    }

    showHasSelectedWebNetwork(show) {
        return show.webChannel
            ? this.selectedWebNetwork
                === show.webChannel.name.toLowerCase()
            : false;
    }
    
    setWebNetworkOptions() {
        this.removePreviousWebNetworkOptions();
    
        Array.from(APP_STATE.webNetworks)
            .sort()
            .forEach(this.createWebNetworkOption);
    }

    removePreviousWebNetworkOptions() {
        const allWebNetworks = Array.from(
            this.webNetworksList.querySelectorAll("option")
        );
        const previousWebNetworks = allWebNetworks.filter(webNetwork => {
            return webNetwork.classList.contains("dynamic-web-network");
        });
    
        previousWebNetworks.forEach(option => option.remove());
    } 
    
    createWebNetworkOption(webNetwork) {
        const option = document.createElement("option");
        option.classList.add("web-network");
        option.classList.add("dynamic-web-network");
        option.value = webNetwork;
        option.dataset.webNetwork = webNetwork.toLowerCase();
        if (this.selectedWebNetwork === webNetwork.toLowerCase()) {
            option.classList.add("chosen");
        }
        
        this.webNetworksList.append(option);
    }
}