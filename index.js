"use strict";

//function for getting resources
const getResource = async (url) => {
    let result = await fetch(url);

    if (!result.ok) {
        throw new Error(`Could not fetch ${url}, status: ${result.status}`);
    }

    return await result.json();
};

//render select options after page loading
getResource("http://universities.hipolabs.com/search").then((data) => {
    const selectCountry = document.getElementById("selectCountry");
    //removing repeating countries
    const uniqueCountries = data.reduce((countries, obj) => {
        const country = obj.country;

        if (!countries.includes(country)) {
            countries.push(country);
        }

        return countries;
    }, []);

    //adding sorted countries' names to select
    uniqueCountries.sort().forEach((countryName) => {
        const optionElement = document.createElement("option");
        optionElement.textContent = countryName;
        selectCountry.appendChild(optionElement);
    });
});

//getting data for country list (table) and 'save' it
let universitiesData = [];
getResource("http://universities.hipolabs.com/search").then((data) => {
    universitiesData = data;
});

//filter function for input and select
const filterResult = () => {
    const countryFilter = document.getElementById("selectCountry").value;
    const nameFilter = document.getElementById("name").value.toLowerCase();
    const tableBody = document.querySelector(".table-body");

    //clear table body
    tableBody.innerHTML = "";

    const filteredUniversities = universitiesData.filter((university) => {
        const universityName = university.name.toLowerCase();

        // combination of name and country filters
        return (
            (countryFilter === "" || university.country === countryFilter) &&
            (nameFilter === "" || universityName.includes(nameFilter))
        );
    });

    const universitiesToShow = filteredUniversities.slice(0, 10).sort();

    //adding filtered data to html
    universitiesToShow.forEach((university) => {
        const rowHTML = `
            <tr>
                <td>${university.name}</td>
                <td>${university.country}</td>
                <td>${
                    university["state-province"] === null
                        ? "-"
                        : university["state-province"]
                }</td>
                <td class="t-url">
                        <a href="${university.web_pages}">${
            university.web_pages
        }</a
                        ><svg
                            width="16"
                            height="16"
                            viewBox="0 0 16 16"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <g id="External Link">
                                <path
                                    id="Vector"
                                    d="M9 2V3H12.293L6.02344 9.27344L6.72656 9.97656L13 3.70703V7H14V2H9ZM4 4C2.89453 4 2 4.89453 2 6V12C2 13.1055 2.89453 14 4 14H10C11.1055 14 12 13.1055 12 12V7L11 8V12C11 12.5508 10.5508 13 10 13H4C3.44922 13 3 12.5508 3 12V6C3 5.44922 3.44922 5 4 5H8L9 4H4Z"
                                    fill="#4094F7"
                                />
                            </g>
                        </svg>
                    </td>
            </tr>
        `;

        tableBody.insertAdjacentHTML("beforeend", rowHTML);
    });
};

//clear filter function for button
function clearFilters() {
    document.getElementById("selectCountry").value = "";
    document.getElementById("name").value = "";
    document.querySelector(".table-body").innerHTML = "";
}

document.getElementById("selectCountry").onchange = filterResult;
document.getElementById("name").onkeyup = filterResult;
document.getElementById("getStarted").onclick = clearFilters;
