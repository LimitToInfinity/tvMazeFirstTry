import { APP_STATE } from "./index.js";

export class WebNetworkSelector {
    constructor() {
        this.selectedWebNetwork = undefined;

        this.webNetworksContainer = document
            .querySelector(".web-networks-container");
        this.webNetworksSearch = this.webNetworksContainer
            .querySelector("input");
        this.webNetworksList = this.webNetworksContainer
            .querySelector("datalist");

        this.handleWebNetworks = this.handleWebNetworks.bind(this);
        this.showHasSelectedWebNetwork =
            this.showHasSelectedWebNetwork.bind(this);
        this.createWebNetworkOption =
            this.createWebNetworkOption.bind(this);
        
        this.webNetworksSearch
            .addEventListener("change", this.handleWebNetworks);
        this.webNetworksSearch
            .addEventListener("click", this.clearText);
        this.webNetworksSearch
            .addEventListener("blur", this.clearText);
    }

    handleWebNetworks(event) {
        const selectedWebNetwork = event.target.value;

        switch (true) {
            case selectedWebNetwork !== "All networks":
                const selectedWebNetworkOption = document.querySelector(
                    `option[value="${selectedWebNetwork}"]`
                );
                if (selectedWebNetworkOption) {
                    selectedWebNetworkOption.classList.toggle("selected");
                }
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
        if (selectedWebNetwork === "All networks") {
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
            ? this.selectedWebNetwork === show.webChannel.name
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
        option.textContent = webNetwork;
        option.value = webNetwork;
        if (this.selectedWebNetwork === webNetwork) {
            option.classList.add("selected");
        }
        
        this.webNetworksList.append(option);
    }
}