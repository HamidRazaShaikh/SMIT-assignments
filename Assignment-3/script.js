(async () => {
  let fetchData = async () => {
    try {
      const response = await fetch("./data.json");
      const data = await response.json();

      return data.sort(
        (a, b) => a.release_date.slice(0, 4) - b.release_date.slice(0, 4)
      );
    } catch (error) {
      console.log(error);
      return [];
    }
  };

  // element references

  const selectGenre = document.querySelector("#genre");
  const selectYear = document.querySelector("#year");
  const selectLanguage = document.querySelector("#language");
  const selectRating = document.querySelector("#rating");
  const table = document.querySelector(".table");
  const loader = document.querySelector(".loader");
  const count = document.querySelector("#count");

  //  json data stores here

  //   let data = await fetchData();

  // data filters//

  let data = await fetchData();

  const handleChange = async (e, cat) => {
    let term = e.target.value;
    let Data = data;

    if (cat === "genres" && term !== "All") {
      let newData = Data.filter((item) => {
        return item.genres.includes(term);
      });

      data = newData;
      tableGenerator();
    }

    if (cat === "year" && term !== "All") {
      let newData = Data.filter((item) => {
        return item.release_date.includes(term);
      });

      data = newData;
      tableGenerator();
    } else if (cat === "language" && term !== "All") {
      let newData = Data.filter((item) => {
        return item.original_language.includes(term);
      });

      data = newData;
      tableGenerator();
    } else if (cat === "rating" && term !== "All") {
      let newData = Data.filter((item) => {
        return item.vote_average === +term;
      });

      data = newData;
      tableGenerator();
      console.log(data);
    } else if (term === "All") {
      data = await fetchData();
      tableGenerator();
    }
  };

  selectGenre.addEventListener("change", (e) => handleChange(e, "genres"));
  selectYear.addEventListener("change", (e) => handleChange(e, "year"));
  selectLanguage.addEventListener("change", (e) => handleChange(e, "language"));
  selectRating.addEventListener("change", (e) => handleChange(e, "rating"));

  // genre dynamic listing

  const optionGenerator = async () => {
    let data = await fetchData();

    let genreCate = (() => {
      let genreList = [];
      data.forEach((item) => {
        genreList.push(item.genres);
      });

      let reduceList = new Set(genreList.reduce((a, b) => a.concat(b), []));

      return ["All", ...reduceList];
    })();

    let yearCate = (() => {
      let yearList = [];
      data.forEach((item) => {
        let value = item.release_date.trim().slice(0, 4);
        yearList.push(value);
      });

      let reduceList = new Set(yearList);

      return ["All", ...reduceList].sort((a, b) => b - a);
    })();

    let languageCate = (() => {
      let languageList = [];
      data.forEach((item) => {
        languageList.push(item.original_language.trim());
      });

      let reduceList = new Set(languageList);

      return ["All", ...reduceList];
    })();

    let ratingCate = (() => {
      let ratingList = [];
      data.forEach((item) => {
        ratingList.push(item.vote_average);
      });

      let reduceList = new Set(ratingList);

      return ["All", ...reduceList].sort((a, b) => b - a);
    })();

    // dynamic addition select option

    genreCate.map((item) => {
      selectGenre.add(new Option(item, item));
    });

    yearCate.map((item) => {
      selectYear.add(new Option(item, item));
    });

    languageCate.map((item) => {
      selectLanguage.add(new Option(item, item));
    });

    ratingCate.map((item) => {
      selectRating.add(new Option(item, item));
    });
  };

  optionGenerator();

  // table manuipulation//

  // misc funcion //

  const timeFormat = (min) => {
    let string = (min / 60).toString();
    let index = string.indexOf(".");
    if (index !== -1) {
      let hr = string.slice(0, index);
      let minutes = (Number(string.slice(index, string.length)) * 60)
        .toFixed(0)
        .toString();
      return hr + "h" + " " + minutes + "m";
    } else {
      return (min / 2).toString() + "h" + " " + "0 m";
    }
  };

  const genreFormat = (input) => {
    return input.toString();
  };

  const tableGenerator = () => {
    table.innerHTML = `  <thead>
    <tr>
      <th>Rank</th>
      <th>Movie</th>
      <th>Year</th>
    </tr>
  </thead>
  <tbody></tbody>`;

    if (data.length !== -1) {
      count.innerHTML = `<h5> Total : ${data.length}</h5>`;

      loader.removeAttribute("class");
      table.classList.add("table");

      data.map((item, index) => {
        divElem = `<div>
    <div>  <img src = "./images/movie_image.webp" alt = ${item.title}</div>
    <div>
    <h2>${item.title}</h2>
    <div>
    <span>${item?.certification}</span>
    <h4>${genreFormat(item?.genres)}</h4>
    <h3>${timeFormat(item?.runtime)}</h3>
    </div>
    </div>
        
    
    
        </div>`;

        (row = table.insertRow(1)),
          (cell1 = row.insertCell(0)),
          (cell2 = row.insertCell(1));
        cell3 = row.insertCell(2);
        cell1.innerHTML = data.length - index;
        cell2.innerHTML = divElem;
        cell3.innerHTML = item.release_date.trim().slice(0, 4);
      });
    } else {
      table.removeAttribute("class");
      loader.classList.add("loader");
    }
  };

  tableGenerator();

  // end
})();
