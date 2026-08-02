(() => {
  const lessons = {
    "skill-01-nobody-ever-taught-me-this": ["You are not expected to know car care automatically.", "Start with one small skill and use the owner’s manual whenever your vehicle differs."],
    "skill-02-find-owners-manual": ["Look in the glove compartment or search the manufacturer’s official website using the vehicle year, make, and model.", "The owner’s manual is the final authority for vehicle-specific controls, fluids, warnings, and procedures."],
    "skill-03-scheduled-maintenance": ["Find the maintenance schedule in the owner’s manual.", "Track service by both time and mileage, and keep receipts or a service record."],
    "skill-04-tool-kit": ["Begin with a flashlight, gloves, tire gauge, basic hand tools, and a clean rag.", "Choose tools that match your vehicle and the tasks you are prepared to perform safely."],
    "skill-05-open-the-hood": ["Park, turn the vehicle off, set the parking brake, and find the interior hood release.", "Release the secondary latch, lift carefully, and secure the hood exactly as the owner’s manual describes. Never force it."],
    "skill-06-dashboard-lights": ["A warning light’s color is a useful clue, not a universal diagnosis.", "Identify the exact symbol in the owner’s manual. Pull over safely for urgent warnings, flashing lights, overheating, oil-pressure warnings, braking problems, or unusual vehicle behavior."],
    "skill-07-engine-oil": ["Park on level ground and follow the owner’s manual for whether the engine should be warm or cold.", "Remove and wipe the dipstick, reinsert it fully, then check that the level is between the marks. Use only the specified oil."],
    "skill-08-add-washer-fluid": ["With the vehicle off, identify the washer-fluid reservoir by its windshield symbol.", "Add proper washer fluid without overfilling. Never confuse it with coolant, brake fluid, or another reservoir."],
    "skill-09-checking-air-pressure": ["Use the pressure listed on the driver-door label or in the owner’s manual—not the maximum molded into the tire sidewall.", "Check cold tires with a gauge and adjust all tires to the vehicle specification."],
    "skill-10-tire-tread-wear": ["Inspect tread depth and look for uneven wear, cracks, bulges, objects, or exposed cords.", "A damaged or badly worn tire needs professional attention; do not rely on a tread test alone."],
    "skill-11-pumping-gas": ["Turn off the engine, confirm the required fuel, and select the correct pump grade.", "Do not smoke or reenter the vehicle while fueling. Stop when the nozzle clicks off and replace the cap securely."],
    "skill-12-battery-basics": ["Battery location and jump points vary, especially on hybrids, EVs, and vehicles with remote terminals.", "Before jump-starting, read both vehicles’ manuals. Do not proceed with a cracked, leaking, frozen, or visibly damaged battery; call for help instead."],
    "skill-13-changing-a-flat-tire": ["Move well away from traffic onto firm, level ground and use the parking brake and hazard lights.", "Follow the owner’s manual for jack points and wheel procedure. If the location or conditions are unsafe, stay clear of traffic and call roadside assistance."],
    "skill-14-connect-android-auto": ["Connect and configure Android Auto while parked.", "Approve prompts, set the route, and put the phone away before the vehicle moves."],
    "skill-15-connect-apple-carplay": ["Connect and configure Apple CarPlay while parked.", "Approve prompts, set the route, and put the phone away before the vehicle moves."],
    "skill-16-clean-the-windshield": ["Clean the outside glass with suitable cleaner and a clean cloth, then clean the inside to remove haze.", "Replace damaged wiper blades and keep the washer reservoir filled with proper fluid."],
    "skill-17-tool-kit": ["Carry a flashlight, reflective warning equipment, gloves, tire gauge, first-aid supplies, water, phone charger, and vehicle-appropriate emergency equipment.", "Secure loose items so they cannot become hazards in a sudden stop."],
    "skill-18-squeaky-brakes": ["Brake noises can signal wear, debris, moisture, or a more serious problem.", "Grinding, reduced braking, pulling, vibration, warning lights, or a soft pedal require prompt professional attention. Do not keep driving a vehicle that may not stop safely."],
    "skill-19-call-for-help": ["Stop when the situation is unsafe, the vehicle behaves abnormally, or you do not understand the required procedure.", "Move away from traffic if possible, use hazard lights, share your location, and contact roadside assistance, emergency services, or a trusted person as appropriate."],
    "skill-20-monthly-checks": ["Once a month, inspect tires, lights, washer fluid, visible leaks, wiper condition, and warning indicators.", "Use the owner’s manual for the complete vehicle-specific schedule and address changes before they become larger problems."]
  };

  const key = Object.keys(lessons).find((name) => location.pathname.includes(name));
  const lesson = document.querySelector(".skill-lesson");
  if (!key || !lesson) return;

  const section = document.createElement("section");
  section.className = "accessible-summary";
  section.setAttribute("aria-labelledby", "accessible-summary-title");
  section.innerHTML = `<h2 id="accessible-summary-title">Quick text summary</h2><p class="summary-intro">Prefer text, using a screen reader, or need the main idea quickly?</p><ol>${lessons[key].map((item) => `<li>${item}</li>`).join("")}</ol><p class="vehicle-note"><strong>Important:</strong> Vehicles differ. Follow your owner’s manual whenever its instructions differ from this general guide.</p>`;
  lesson.insertBefore(section, lesson.querySelector(".lesson-actions"));

  let adventureUrl = null;
  try {
    const referrer = new URL(document.referrer);
    const adventurePath = /^\/driver-confidence-guide\/adventures\/([a-z0-9-]+)\/index\.html$/;
    if (referrer.origin === location.origin && adventurePath.test(referrer.pathname)) {
      adventureUrl = referrer.href;
    }
  } catch (_) {
    adventureUrl = null;
  }

  if (adventureUrl) {
    const returnBar = document.createElement("nav");
    returnBar.setAttribute("aria-label", "Return to Adventure");
    returnBar.style.cssText = "position:sticky;top:68px;z-index:7;margin:0 0 18px;padding:14px 16px;border:2px solid #287a4b;border-radius:12px;background:#edf8f1;box-shadow:0 5px 16px rgba(23,50,74,.14);text-align:center";

    const returnButton = document.createElement("button");
    returnButton.type = "button";
    returnButton.textContent = "← Return to Adventure";
    returnButton.style.cssText = "padding:12px 18px;border:0;border-radius:9px;background:#287a4b;color:#fff;font:inherit;font-weight:800;cursor:pointer";
    returnButton.addEventListener("click", () => {
      window.close();
      setTimeout(() => { location.href = adventureUrl; }, 250);
    });

    const note = document.createElement("span");
    note.textContent = " Your story progress is waiting in the previous tab.";
    note.style.cssText = "display:block;margin-top:7px;color:#365747;font-size:.9rem";

    returnBar.append(returnButton, note);
    lesson.insertBefore(returnBar, lesson.firstChild);
  }
})();
