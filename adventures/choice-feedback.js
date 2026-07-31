(() => {
  const choice = new URLSearchParams(location.search).get("choice");
  const messages = {
    "phone-pass-around": ["That could work—but set it up before moving", "Passing the phone around creates distraction and confusion. Alex stays parked, chooses one navigator, and confirms the route before leaving."],
    "phone-red-light": ["A red light is not setup time", "Waiting for a stoplight still divides Alex’s attention between traffic and the phone. The safer move is to finish setup while parked."],
    "phone-no-music": ["Safe, but it does not solve the route", "Skipping music removes one distraction, but Alex still needs directions. He sets the route while parked before everyone leaves."],
    "fuel-ignore": ["Hope is not a fuel plan", "The remaining range is uncertain. Alex stops before the warning becomes a roadside problem."],
    "fuel-confidence": ["Tyler’s confidence is not a gauge", "Guessing at range cannot replace the dashboard, owner’s manual, or a fuel stop. Alex checks the requirement and stops now."],
    "windshield-wipers": ["Dry wipers can make the mess worse", "Running dry blades may smear debris and reduce visibility. Alex cleans the glass properly before driving."],
    "windshield-ignore": ["A funny name does not improve visibility", "Even a small obstruction can become dangerous in glare or darkness. Alex cleans the windshield before leaving."],
    "tire-lean": ["Passengers are not tire-pressure equipment", "Moving weight does not correct an underinflated tire. Alex uses a gauge before the trip."],
    "tire-encourage": ["Encouragement is free. Air pressure still matters", "A tire that looks low needs a gauge, not optimism. Alex checks all four tires before the highway."],
    "tire-ignore": ["The highway is a poor place to test a low tire", "Passengers, gear, speed, and heat can make a tire problem worse. Alex checks it before leaving."],
    "toolkit-chips": ["Snacks help morale, not roadside trouble", "The chips can stay, but Alex also packs equipment that can help the group see, signal, measure, and call for assistance."],
    "toolkit-spoon": ["The spoon keeps its pudding assignment", "A spoon cannot replace a flashlight, gloves, tire gauge, warning equipment, or emergency supplies."],
    "toolkit-freshener": ["The car will smell prepared", "The air freshener is optional. The flashlight, gloves, warning equipment, and emergency supplies are not."],
    "breakdown-repair": ["A half-watched video is not a diagnosis", "Opening the hood beside traffic can add danger without solving the unknown problem. Alex calls for qualified help."],
    "breakdown-music": ["Louder music only hides information", "A new clunking sound can warn of a serious problem. Alex stops driving rather than masking the symptom."],
    "breakdown-ignore": ["Weekend plans do not make the car safe", "Continuing with an unidentified loud clunk could worsen damage or create a crash risk. Alex stays stopped and calls for help."]
  };
  const message = messages[choice];
  const card = document.querySelector(".result-card, .completion-card");
  if (!message || !card) return;
  const feedback = document.createElement("section");
  feedback.className = "choice-consequence";
  feedback.innerHTML = `<p class="adventure-label">Your choice</p><h2>${message[0]}</h2><p>${message[1]}</p>`;
  card.insertBefore(feedback, card.querySelector(".skill-box, .button-row"));
})();
