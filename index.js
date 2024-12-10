const translations = {
    en: {
        headerTitle: "Azan Prayer Times",
        headerDescription: "Accurate prayer timings with notifications",
        prayerHeading: "Today's Prayer Times",
        locationLabel: "Select Language:",
        dua: "Dua After Azan: O Allah! Lord of this perfect call and established prayer, grant Muhammad the intercession and favor, and raise him to the honored position You have promised him.",
    },
    ur: {
        headerTitle: "اذان کے اوقات",
        headerDescription: "اطلاعات کے ساتھ نماز کے درست اوقات",
        prayerHeading: "آج کے اذان کے اوقات",
        locationLabel: "زبان منتخب کریں:",
        dua: "اذان کے بعد کی دعا: اے اللہ! اس مکمل دعوت اور قائم کی گئی نماز کے رب، محمد کو شفاعت اور فضیلت عطا فرما اور انہیں وہ معزز مقام عطا فرما جس کا تو نے ان سے وعدہ کیا ہے۔",
    },
};

function applyLanguage() {
    const lang = localStorage.getItem("language") || "en";
    const t = translations[lang] || translations.en;
    document.getElementById("header-title").textContent = t.headerTitle;
    document.getElementById("header-description").textContent = t.headerDescription;
    document.getElementById("prayer-heading").textContent = t.prayerHeading;
    document.getElementById("language-label").textContent = t.locationLabel;
    document.getElementById("dua").textContent = t.dua;
}

function changeLanguage() {
    const lang = document.getElementById("language-selector").value;
    localStorage.setItem("language", lang);
    applyLanguage();
}

function populateLanguageSelector() {
    const languages = [
        { code: "en", name: "English" },
        { code: "ur", name: "Urdu" },
    ];

    const selector = document.getElementById("language-selector");
    languages.forEach(lang => {
        const option = document.createElement("option");
        option.value = lang.code;
        option.textContent = lang.name;
        selector.appendChild(option);
    });
    selector.value = localStorage.getItem("language") || "en";
}

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(fetchPrayerTimes, () => {
            alert("Failed to get location.");
        });
    } else {
        alert("Geolocation not supported.");
    }
}

function fetchPrayerTimes(position) {
    const { latitude, longitude } = position.coords;
    fetch(`https://api.aladhan.com/v1/timings?latitude=${latitude}&longitude=${longitude}&method=2`)
        .then(res => res.json())
        .then(data => {
            displayPrayerTimes(data.data.timings);
        })
        .catch(() => alert("Failed to fetch prayer times."));
}

function displayPrayerTimes(timings) {
    const container = document.getElementById("prayer-times");
    container.innerHTML = "";

    Object.entries(timings).forEach(([prayer, time]) => {
        const div = document.createElement("div");
        div.className = "prayer-time";
        div.innerHTML = `<strong>${prayer}:</strong> ${time}`;
        
        const dropdown = document.createElement("div");
        dropdown.className = "dropdown";
        dropdown.innerHTML = `<button onclick="setAlarm('${prayer}', '${time}')">Set Alarm</button>`;
        div.appendChild(dropdown);

        container.appendChild(div);
    });
}

function setAlarm(prayer, time) {
    const alarmTime = new Date();
    const [hours, minutes] = time.split(":").map(Number);
    alarmTime.setHours(hours, minutes, 0);

    const now = new Date();
    const delay = alarmTime - now;

    if (delay > 0) {
        setTimeout(() => {
            if (prayer.toLowerCase() === "fajr") {
                document.getElementById("fajr-alarm-sound").play();
            } else {
                document.getElementById("azan-alarm-sound").play();
            }
            alert(`It's time for ${prayer}`);
        }, delay);
    } else {
        alert("This prayer time has passed.");
    }
}

document.addEventListener("DOMContentLoaded", () => {
    applyLanguage();
    populateLanguageSelector();
    getLocation();
});
