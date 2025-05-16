const fretboard = document.getElementById("fretboard");
const resetButton = document.getElementById("resetButton");
const toggleTheme = document.getElementById("toggleTheme");

const chordDictionary = {
  // Major triads
  "A C# E": "A",
  "C# E A": "A",
  "E A C#": "A",

  "A# D F": "A#",
  "D F A#": "A#",
  "F A# D": "A#",

  "B D# F#": "B",
  "D# F# B": "B",
  "F# B D#": "B",

  "C E G": "C",
  "E G C": "C",
  "G C E": "C",

  "C# F G#": "C#",
  "F G# C#": "C#",
  "G# C# F": "C#",

  "D F# A": "D",
  "F# A D": "D",
  "A D F#": "D",

  "D# G A#": "D#",
  "G A# D#": "D#",
  "A# D# G": "D#",

  "E G# B": "E",
  "G# B E": "E",
  "B E G#": "E",

  "F A C": "F",
  "A C F": "F",
  "C F A": "F",

  "F# A# C#": "F#",
  "A# C# F#": "F#",
  "C# F# A#": "F#",

  "G B D": "G",
  "B D G": "G",
  "D G B": "G",

  "G# C D#": "G#",
  "C D# G#": "G#",
  "D# G# C": "G#",

  // Minor triads
  "A C E": "Am",
  "C E A": "Am",
  "E A C": "Am",

  "A# C# F": "A#m",
  "C# F A#": "A#m",
  "F A# C#": "A#m",

  "B D F#": "Bm",
  "D F# B": "Bm",
  "F# B D": "Bm",

  "C D# G": "Cm",
  "D# G C": "Cm",
  "G C D#": "Cm",

  "C# E G#": "C#m",
  "E G# C#": "C#m",
  "G# C# E": "C#m",

  "D F A": "Dm",
  "F A D": "Dm",
  "A D F": "Dm",

  "D# F# A#": "D#m",
  "F# A# D#": "D#m",
  "A# D# F#": "D#m",

  "E G B": "Em",
  "G B E": "Em",
  "B E G": "Em",

  "F G# C": "Fm",
  "G# C F": "Fm",
  "C F G#": "Fm",

  "F# A C#": "F#m",
  "A C# F#": "F#m",
  "C# F# A": "F#m",

  "G A# D": "Gm",
  "A# D G": "Gm",
  "D G A#": "Gm",

  "G# B D#": "G#m",
  "B D# G#": "G#m",
  "D# G# B": "G#m"
};

function manualChordMatch(notes) {
  const key = [...notes].sort().join(" ");
  return chordDictionary[key] || null;
}

const strings = 6;
const frets = 15;
const fretboardWidth = 1200;
const fretWidth = fretboardWidth / frets;
const stringSpacing = 300 / (strings - 1);
const tuning = ["E2", "A2", "D3", "G3", "B3", "E4"]; // Strings 6 to 1
let isLight = false;
let notes = new Set();

// Calculate evenly spaced fret positions
const fretPositions = Array.from({ length: frets }, (_, i) => i * fretWidth);

function createFretboard() {
  fretboard.innerHTML = "";

  // Draw strings
  for (let i = 0; i < strings; i++) {
    const y = (strings - 1 - i) * stringSpacing;
  
    const line = document.createElement("div");
    line.classList.add("string-line");
    line.style.top = `${y}px`;
    fretboard.appendChild(line);
  } 

  // Draw frets
  for (let i = 0; i < frets; i++) {
    const fret = document.createElement("div");
    fret.classList.add("fret");
    fret.style.left = `${fretPositions[i]}px`;
    fretboard.appendChild(fret);
  }

  // Draw fret markers
  const markerFrets = [3, 5, 7, 9, 12];
  markerFrets.forEach(fretNum => {
    const midX = (fretPositions[fretNum] + fretPositions[fretNum - 1]) / 2;

    if (fretNum === 12) {
      // Double dot between strings 2–3 and 4–5
      [1.45, 3.45].forEach(multiplier => {
        const dot = document.createElement("div");
        dot.classList.add("fret-marker");
        dot.style.top = `${multiplier * stringSpacing}px`;
        dot.style.left = `${midX}px`;
        fretboard.appendChild(dot);
      });
    } else {
      const dot = document.createElement("div");
      dot.classList.add("fret-marker");
      dot.style.top = `${stringSpacing * 2.425}px`;
      dot.style.left = `${midX * 1.005}px`;
      fretboard.appendChild(dot);
    }
  });

  // Add clickable note hitboxes
  for (let string = 0; string < strings; string++) {
    for (let fret = 0; fret < frets; fret++) {
      const x = fret === 0
        ? fretWidth / 2
        : (fretPositions[fret] + fretPositions[fret - 1]) / 2;
      const y = (strings - 1 - string) * stringSpacing;

      const hitbox = document.createElement("div");
      hitbox.classList.add("note-hitbox");
      hitbox.style.position = "absolute";
      hitbox.style.width = "40px";
      hitbox.style.height = "40px";
      hitbox.style.left = `${x}px`;
      hitbox.style.top = `${y}px`;
      hitbox.style.transform = "translate(-50%, -50%)";
      hitbox.style.cursor = "pointer";

      hitbox.dataset.string = strings - string; // This converts 0–5 to 6–1
      hitbox.dataset.fret = fret;

      hitbox.addEventListener("click", () => toggleFinger(hitbox, x, y));
      fretboard.appendChild(hitbox);
    }
  }
}

function toggleFinger(hitbox, x, y) {
  const key = `${hitbox.dataset.string}-${hitbox.dataset.fret}`;
  if (notes.has(key)) {
    notes.delete(key);
    const existing = document.querySelector(`[data-key="${key}"]`);
    if (existing) existing.remove();
  } else {
    notes.add(key);
    console.log("Selected notes:", Array.from(notes));
    const dot = document.createElement("div");
    dot.classList.add("note-dot");
    dot.style.left = `${x}px`;
    dot.style.top = `${y}px`;
    dot.dataset.key = key;
    fretboard.appendChild(dot);
  }

  identifyChord();
}

function createStringLabels() {
  const labelContainer = document.getElementById("stringLabels");
  labelContainer.innerHTML = "";

  // Match visual layout top to bottom
  [...tuning].reverse().forEach((note, index) => {
    const label = document.createElement("div");
    label.classList.add("string-label");
    label.style.top = `${index * stringSpacing}px`;
    label.textContent = note;
    labelContainer.appendChild(label);
  });
} 

function createFretNumbers() {
    const fretNumberContainer = document.getElementById("fretNumbers");
    fretNumberContainer.innerHTML = "";
  
    for (let i = 1; i < frets; i++) {
      const x = (fretPositions[i] + fretPositions[i - 1]) / 2;
  
      const number = document.createElement("div");
      number.classList.add("fret-number");
      number.textContent = i;
      number.style.left = `${x}px`;
      fretNumberContainer.appendChild(number);
    }
}

Tonal.Distance = {
  transposeByFret(note, fret) {
    const chromaticSteps = fret;
    const midi = Tonal.Note.midi(note);
    if (midi === null) return "";
    return Tonal.Note.fromMidi(midi + chromaticSteps);
  }
};

function identifyChord() {
  const selected = Array.from(notes);
  const positions = [];

  const selectedStrings = selected.map(k => parseInt(k.split("-")[0]));
  const highestSelected = Math.max(...selectedStrings);

  for (let stringNumber = 6; stringNumber >= 1; stringNumber--) {
    // ✅ Skip low strings not being used
    if (stringNumber > highestSelected) continue;

    const match = selected.find(k => parseInt(k.split("-")[0]) === stringNumber);
    const tuningNote = tuning[6 - stringNumber]; // tuning[0] = string 6 (low E)

    if (!tuningNote) continue;

    const fret = match ? parseInt(match.split("-")[1]) : 0;

    const midi = Tonal.Note.midi(tuningNote);
    if (midi === null) continue;

    const transposedNote = Tonal.Note.fromMidi(midi + fret);
    const pc = Tonal.Note.get(transposedNote).pc;

    if (pc) {
      positions.push(pc);
    }
  }

  const sharpNotes = positions.map(n => Tonal.Note.enharmonic(n));
  const uniqueNotes = [...new Set(sharpNotes)].slice(0, 5);

  let chordName = manualChordMatch(uniqueNotes);

  if (!chordName) {
    const detectedChords = detectChordSmart(uniqueNotes);
    chordName = detectedChords ? detectedChords[0] : "Unknown Chord";
  }

  const barreInfo = detectBarreChord(Array.from(notes));
  console.log("Barre info:", barreInfo);

  if (barreInfo) {
    const { rootNote, shape } = barreInfo;
    const rootNormalized = Tonal.Note.enharmonic(rootNote);

    if (chordName.startsWith(rootNote) || chordName.startsWith(rootNormalized)) {
      chordName += ` (${shape}-shape Barre)`;
    }
  }

  // Remove any existing barre indicator
  const oldBarre = document.querySelector(".barre-indicator");
  if (oldBarre) oldBarre.remove();

  // Add visual barre if shape detected
  if (barreInfo) {
    const fret = barreInfo.lowestFret;
    const x = fret === 0
      ? fretWidth / 2
      : (fretPositions[fret] + fretPositions[fret - 1]) / 2;

    const indicator = document.createElement("div");
    indicator.classList.add("barre-indicator");
    indicator.style.left = `${x - fretWidth / 2}px`;
    indicator.style.top = "0px";
    indicator.style.height = `${stringSpacing * 5}px`; // cover strings 1 to 5 or 6
    fretboard.appendChild(indicator);
  }

  console.log("Chord notes used:", uniqueNotes);
  console.log("Detected chord name:", chordName);

  document.getElementById("chordOutput").innerHTML =
    `Chord: ${chordName} (${uniqueNotes.join(", ")})<br>Fingers: ${Array.from(notes).join(", ")}`;
}

resetButton.addEventListener("click", () => {
    notes.clear();
    createFretboard();
    createStringLabels();
    createFretNumbers();
    document.getElementById("chordOutput").textContent = "Select a shape to identify the chord";
});  

toggleTheme.addEventListener("click", () => {
  isLight = !isLight;
  fretboard.classList.toggle("light", isLight);
});

function detectChordSmart(notes) {
  const sorted = [...notes].sort();

  // Try sorted first
  const priority = Tonal.Chord.detect(sorted);
  if (priority.length > 0) return priority;

  // Prefer root candidates that match chord tones
  const preferredRoots = ["C", "D", "E", "F", "G", "A", "B"];
  const prioritized = [...notes].sort((a, b) => {
    return preferredRoots.indexOf(a) - preferredRoots.indexOf(b);
  });

  const rotated = [...prioritized];
  const firstTry = Tonal.Chord.detect(rotated);
  if (firstTry.length > 0) return firstTry;

  // Full permutations as fallback
  const permutations = getPermutations(notes);
  for (const perm of permutations) {
    const detected = Tonal.Chord.detect(perm);
    if (detected.length > 0) {
      return detected;
    }
  }

  return null;
}

function getPermutations(arr) {
  if (arr.length <= 1) return [arr];

  const results = [];

  for (let i = 0; i < arr.length; i++) {
    const rest = [...arr.slice(0, i), ...arr.slice(i + 1)];
    const inner = getPermutations(rest);
    for (const perm of inner) {
      results.push([arr[i], ...perm]);
    }
  }

  return results;
}

function detectShapePattern(notes) {
  const noteMap = {};
  notes.forEach(n => {
    const [string, fret] = n.split("-").map(Number);
    noteMap[string] = fret;
  });

  const stringsUsed = Object.keys(noteMap).map(Number);

  // === E-shape ===
  const eRootFret = noteMap[6];
  const isEshape = (
    stringsUsed.length === 6 &&
    noteMap[6] === eRootFret &&
    noteMap[1] === eRootFret &&
    noteMap[2] === eRootFret &&
    noteMap[3] === eRootFret + 1 &&
    noteMap[4] === eRootFret + 2 &&
    noteMap[5] === eRootFret + 2
  );
  if (isEshape) return "E";

  // === A-shape ===
  const aRootFret = noteMap[5];
  const isAshape = (
    !noteMap[6] && // string 6 unused
    noteMap[5] === aRootFret &&
    noteMap[1] === aRootFret &&
    noteMap[3] === aRootFret + 2 &&
    noteMap[4] === aRootFret + 2 &&
    (
      noteMap[2] === aRootFret ||        // barre
      noteMap[2] === aRootFret + 2       // 5th voiced up
    )
  );
  if (isAshape) return "A";

  return null;
} 

function detectBarreChord(notes) {
  const noteMap = {};
  notes.forEach(n => {
    const [string, fret] = n.split("-").map(Number);
    noteMap[string] = fret;
  });

  const fretsUsed = Object.values(noteMap);
  const lowestFret = Math.min(...fretsUsed);
  const shape = detectShapePattern(notes);

  if (!shape) return null;

  let rootNote = null;

  if (shape === "E" && noteMap[6]) {
    const fret = noteMap[6];
    rootNote = Tonal.Note.get(Tonal.Note.fromMidi(Tonal.Note.midi("E2") + fret)).pc;
  } else if (shape === "A" && noteMap[5]) {
    const fret = noteMap[5];
    rootNote = Tonal.Note.get(Tonal.Note.fromMidi(Tonal.Note.midi("A2") + fret)).pc;
  }

  return {
    shape,
    lowestFret,
    rootNote
  };
}

resetButton.click(); // Simulate user clicking "Reset"