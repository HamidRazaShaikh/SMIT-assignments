(async () => {
  //data fetching and filter
  const fetchData = async () => {
    let url = window.location.href;
    let data = url.match(/id=[^]*/)[0];
    let id = data.trim().slice(3, data.length);

    try {
      const response = await fetch("./../../data.json");
      const data = await response.json();
      const filterData = await data.filter((item) => item.id === +id);

      return filterData;
    } catch (error) {
      console.log(error);
      return [];
    }
  };

  let data = await fetchData();

  // element references//

  const imageDiv = document.querySelector(".image_div");
  const detailDiv = document.querySelector(".detail_div");

  console.log(imageDiv, detailDiv);

  const addElements = (item) => {
    console.log(item.similar);

    const similar = (obj) => {
      return `<ul>${obj.slice(0, 5).map((value, i) => {
        return `<li key = ${i}>${value.title}</li>`;
      })}</ul>`;
    };

    imageDiv.innerHTML = `<img src = "https://image.tmdb.org/t/p/w500${item.poster_path}" alt = ${item.title}>`;
    detailDiv.innerHTML = `<div>
    <h2>${item.title}</h2>
    <div class = 'info_div'>
        <h4>${item.genres.toString()}</h4>
        <h4>${item.release_date.trim().slice(0, 4)}</h4>
        <h4>${item.original_language}</h4>
        <h4>${item.vote_average}</h4>
    </div>
   

</div>
<h3>Description</h3>
<p>${item.overview}</p>

<h3>Related</h3>


<div>


${similar(item.similar)}

</div>`;
  };

  addElements(data.at(0));
})();
