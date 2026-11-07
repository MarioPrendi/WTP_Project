const featuredContainer = document.getElementById("featured-container");

//forEach to loop thorugh every obj in the destinations array
//innerHTML stores the html inside the container
//+= means we are adding more content without replacing what was already there
//backticks allow us to insert variables directly into strings 

const searchInput = document.getElementById("searchInput");

const categoryFilter = document.getElementById("categoryFilter");

function displayDestination(){
    
    const searchValue = searchInput.value.toLocaleLowerCase();
    const selectedCategory = categoryFilter.value;

    const filteredDestinations = destinations.filter(destination => {

        //checks whether the destination name matches the search
        const matchesName = destination.name.toLocaleLowerCase().includes(searchValue);

        //checks whether the destination belongs to the selected category
        const matchesCategory = selectedCategory === "all" || destination.category.toLocaleLowerCase() === selectedCategory;

        //keeps destinations that satisfy both conditions
        return matchesName && matchesCategory;
    })

    //this clears the container before displaying the results
    featuredContainer.innerHTML = "";

    filteredDestinations.forEach(destination => {
         featuredContainer.innerHTML += `
             <div class = "destination-card">
                 <img src="${destination.image}" alt="${destination.name}">
                 <h3>${destination.name}</h3>
                 <p>Country${destination.country}</p>
                 <p>Category${destination.category}</p>
                 <p>Price${destination.price}</p>
                 <p>${destination.description}</p>
             </div>    
         `;
    });
};

//search event
searchInput.addEventListener("input", displayDestination);
//category event
categoryFilter.addEventListener("change", displayDestination);
//display all the destinations when the page loads
displayDestination();