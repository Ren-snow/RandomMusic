async function getAccessToken() {
    const response = await fetch("/api/token");
    const data = await response.json();
    return data.access_token;
}

const contentsWrapper = document.querySelector("#js-contents-wrapper");
const album = document.querySelector("#js-album");
const artist = document.querySelector("#js-artist");
const imgWrapper = document.querySelector("#js-image-wrapper");

const selectedDecade = document.querySelector("#decade");
const button = document.querySelector("#button");

button.addEventListener("click", async () => {
    const token = await getAccessToken();
    const fromYear = Number(selectedDecade.value.slice(0, 4));
    const toYear = fromYear + 9;

    if (fromYear) {
        document.querySelector("#not-selected").classList.add("hidden");
        imgWrapper.classList.add("max-h-96");
        imgWrapper.classList.add("mb-3");
        const response = await fetch(
            `https://api.spotify.com/v1/search?q=year:${fromYear}-${toYear}&type=album&limit=50`,
            {
                headers: { Authorization: `Bearer ${token}` },
            }
        );

        const data = await response.json();
        const filteredData = data.albums.items.filter((info) => {
            return info.album_type === "album";
        });

        const count = filteredData.length;
        const rand = Math.floor(Math.random() * count);
        const albumName = filteredData[rand].name;
        album.innerText = albumName;
        album.classList.add("mb-1");

        const albumArtist = filteredData[rand].artists[0].name;
        artist.innerText = albumArtist;
        artist.classList.add("mb-9");

        if (filteredData[rand].images[1].url) {
            const img = document.querySelector("#image");
            img.classList.remove("opacity-0");
            img.classList.add("opacity-100");
            img.src = filteredData[rand].images[1].url;
        } else {
            img.src = "images/no-image.png";
        }

        button.disabled = true;
        button.classList.add("pointer-events-none");
        selectedDecade.classList.add("pointer-events-none");

        const albumUrl = document.querySelector("#albumURL");
        albumUrl.href = filteredData[rand].external_urls.spotify;
        albumUrl.classList.remove("hidden");
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
    } else {
        document.querySelector("#not-selected").classList.remove("hidden");
        console.log("Error: Decade not selected");
    }
});
