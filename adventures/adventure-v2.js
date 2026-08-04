document.addEventListener('DOMContentLoaded',()=>{
  const steps=[...document.querySelectorAll('.episode-step')];
  const fill=document.querySelector('.progress-fill');
  const progressTrack=document.querySelector('.progress-track');
  const status=document.querySelector('.scene-status');
  const scoreText=document.querySelector('.score-value');
  const finalScore=document.querySelector('.final-score-value');
  const completedSteps=new Set();
  const storageKey=`dcg-adventure:${location.pathname}`;
  const completionKey=`${storageKey}:completion-reported`;
  const seasonKey='dcg-season-1-progress';
  let current=0;

  const season=[
    {slug:'borrowing-moms-car',title:"Borrow Mom's Car",teaser:'Alex returns the keys, but the crew’s next outing includes low fuel, zoo parking, and a bird with excellent aim.'},
    {slug:'zoo-day',title:'Go to the Zoo',teaser:'The zoo trip ends safely. Next, the crew trades pavement for gravel, packed gear, and a tire that chooses terrible timing.'},
    {slug:'go-camping',title:'Go Camping',teaser:'Camping proves they can handle the unexpected. Emma’s important morning is about to test whether she can change the plan before trouble changes it for her.'},
    {slug:'emmas-important-morning',title:"Emma's Very Important Morning",teaser:'Emma makes the smart call. Movie night is next, where glare, a questionable tire, and a silent starter join the cast.'},
    {slug:'movie-night',title:'Movie Night at Roadhouse',teaser:'The movie ends. The next grocery run begins innocently, which is usually when a watermelon decides to become a projectile.'},
    {slug:'grocery-run',title:'The Grocery Run That Grew Teeth',teaser:'The yogurt survives. Next, Alex moves into college with cargo Tetris, campus confusion, and an overheating lesson in line.'},
    {slug:'first-day-college',title:'Alex Moves into College',teaser:'Alex reaches campus. The crew’s next test happens after dark, when small problems become harder to read and easier to imagine.'},
    {slug:'driving-home-at-night',title:'Driving Home After Dark',teaser:'Everyone gets home safely. Prom night is next, and formal clothes do not make curb damage or tire trouble more elegant.'},
    {slug:'prom-night',title:'Prom Night Without the Limousine',teaser:'Prom survives the changed plan. Next stop: Mount Lemmon, where mountain roads reward preparation and punish wishful thinking.'},
    {slug:'mount-lemmon',title:'Escape to Mount Lemmon',teaser:'The mountain teaches its lesson. Tucson’s monsoon season is next, with dust, water, visibility, and absolutely no respect for schedules.'},
    {slug:'arizona-monsoon',title:'Monsoon on the Way Home',teaser:'The storm passes. The season finale sends the crew to Phoenix, where preparation matters and fatigue gets the final vote.'},
    {slug:'road-trip-phoenix',title:'Your First Road Trip to Phoenix',teaser:'The road trip is complete—but Tucson still has one local trick left: a dark HAWK signal that suddenly starts talking.'},
    {slug:'hawk-signal-visitor',title:'The Tucson Signal That Goes Dark',teaser:'Jordan understands the signal. Next, Emma learns to recognize a pedestrian emergency while it is still only a collection of clues.'},
    {slug:'unexpected-pedestrians',title:'Unexpected Pedestrians',teaser:'Emma sees the emergency early. Next, Maya faces a disappearing lane and discovers that taking turns can be a traffic strategy instead of a childhood lecture.'},
    {slug:'zipper-merge',title:'The Lane That Disappears',teaser:'Maya completes the merge. Next, Tucson offers yellow-light racers, a fresh-green trap, and an intersection with nowhere to put another car.'},
    {slug:'changing-traffic-lights',title:'The Light Is Not a Starting Gun',teaser:'Maya handles the signals. Next, Tyler meets Cortaro traffic, railroad tracks, and the alarming discovery that awareness cannot be outsourced.'},
    {slug:'cortaro-railroad-crossing',title:'Tyler versus the Tracks',teaser:'Tyler clears the rails. Next, Alex faces I-10, where the entrance ramp is for building speed—not holding a small meeting.'},
    {slug:'alex-joins-i10',title:'Alex Joins I-10',teaser:'Alex completes his first clean freeway trip. Next, the left lane offers a dangerous mythology involving speed, pride, and one very impatient pickup.'},
    {slug:'alex-fast-lane-myth',title:'Alex and the Fast-Lane Myth',teaser:'Season 1 complete. Alex learns that safe interstate driving is cooperation, not a rolling audition for NASCAR.'}
  ];

  const currentSlug=location.pathname.split('/').filter(Boolean).slice(-2,-1)[0]||'';
  const adventureIndex=season.findIndex(item=>item.slug===currentSlug);

  function readSeasonProgress(){
    try{
      const value=JSON.parse(localStorage.getItem(seasonKey));
      return value&&Array.isArray(value.completed)?value:{completed:[],lastVisited:null};
    }catch(_){
      return {completed:[],lastVisited:null};
    }
  }

  function writeSeasonProgress(progress){
    try{localStorage.setItem(seasonKey,JSON.stringify(progress));}catch(_){}
  }

  function markVisited(){
    if(adventureIndex<0) return;
    const progress=readSeasonProgress();
    progress.lastVisited=currentSlug;
    writeSeasonProgress(progress);
  }

  function markAdventureComplete(){
    if(adventureIndex<0) return;
    const progress=readSeasonProgress();
    if(!progress.completed.includes(currentSlug)) progress.completed.push(currentSlug);
    progress.lastVisited=currentSlug;
    writeSeasonProgress(progress);
  }

  function addSeasonStatus(){
    if(adventureIndex<0||!document.querySelector('.adventure-status')) return;
    const progress=readSeasonProgress();
    const seasonStatus=document.createElement('div');
    seasonStatus.className='season-status';
    seasonStatus.textContent=`Season 1 · Adventure ${adventureIndex+1} of ${season.length} · ${progress.completed.length} completed`;
    document.querySelector('.adventure-status').insertAdjacentElement('afterend',seasonStatus);
  }

  function addFinishMagnets(){
    const finish=document.querySelector('.adventure-finish');
    if(!finish||finish.querySelector('.continuity-card')||adventureIndex<0) return;
    const progress=readSeasonProgress();
    const next=season[adventureIndex+1];
    const card=document.createElement('aside');
    card.className='continuity-card';
    const identity=document.createElement('p');
    identity.className='identity-reward';
    identity.textContent='You are becoming the kind of driver who checks first, stays calm, and knows when to change the plan.';
    const progressText=document.createElement('p');
    progressText.className='season-progress-copy';
    progressText.textContent=`Season progress: ${progress.completed.length} of ${season.length} Adventures completed.`;
    const teaser=document.createElement('p');
    teaser.className='next-story-teaser';
    teaser.textContent=season[adventureIndex].teaser;
    card.append(identity,progressText,teaser);
    if(next){
      const link=document.createElement('a');
      link.className='nav-button primary continuity-button';
      link.href=`../${next.slug}/index.html`;
      link.textContent=`Next Adventure: ${next.title}`;
      card.appendChild(link);
    }else{
      const link=document.createElement('a');
      link.className='nav-button primary continuity-button';
      link.href='../../adventures.html';
      link.textContent='Revisit Season 1';
      card.appendChild(link);
    }
    const links=finish.querySelector('.adventure-links');
    finish.insertBefore(card,links||null);
  }

  function reportEvent(name,details={}){
    if(typeof window.gtag!=="function") return;
    window.gtag("event",name,{adventure_path:location.pathname,...details});
  }

  document.querySelectorAll('.outcome.risky .continue-button').forEach(next=>next.remove());

  function saveState(){
    try{localStorage.setItem(storageKey,JSON.stringify({current,completed:[...completedSteps]}));}catch(_){}
  }

  function readState(){
    try{
      let raw=localStorage.getItem(storageKey);
      if(!raw){
        raw=sessionStorage.getItem(storageKey);
        if(raw){
          localStorage.setItem(storageKey,raw);
          sessionStorage.removeItem(storageKey);
        }
      }
      const saved=JSON.parse(raw);
      if(!saved||!Array.isArray(saved.completed)) return null;
      return saved;
    }catch(_){return null;}
  }

  function updateScore(){
    const score=completedSteps.size;
    const decisionCount=Math.max(1,steps.length-1);
    const percent=Math.min(100,(score/decisionCount)*100);
    if(scoreText) scoreText.textContent=score;
    if(finalScore) finalScore.textContent=score;
    if(fill) fill.style.width=`${percent}%`;
    if(progressTrack){
      progressTrack.setAttribute('role','progressbar');
      progressTrack.setAttribute('aria-label','Adventure decisions completed');
      progressTrack.setAttribute('aria-valuemin','0');
      progressTrack.setAttribute('aria-valuemax',String(decisionCount));
      progressTrack.setAttribute('aria-valuenow',String(score));
    }
  }

  function showStep(index){
    const safeIndex=Math.max(0,Math.min(index,steps.length-1));
    steps.forEach((step,i)=>step.classList.toggle('is-active',i===safeIndex));
    current=safeIndex;
    const isFinish=safeIndex===steps.length-1;
    const decisionCount=steps.length-1;
    if(status) status.textContent=isFinish?'Adventure complete':`Scene ${safeIndex+1} of ${decisionCount}`;
    updateScore();
    saveState();
    if(isFinish){
      if(completedSteps.size===decisionCount){
        markAdventureComplete();
        addFinishMagnets();
        let alreadyReported=false;
        try{
          alreadyReported=localStorage.getItem(completionKey)==="true";
          if(!alreadyReported&&sessionStorage.getItem(completionKey)==="true"){
            alreadyReported=true;
            localStorage.setItem(completionKey,'true');
            sessionStorage.removeItem(completionKey);
          }
        }catch(_){}
        if(!alreadyReported){
          reportEvent('adventure_complete',{decisions_completed:completedSteps.size});
          try{localStorage.setItem(completionKey,'true');sessionStorage.removeItem(completionKey);}catch(_){}
        }
      }
      const adventureStatus=document.querySelector('.adventure-status');
      if(adventureStatus) adventureStatus.scrollIntoView({behavior:'smooth',block:'start'});
    }
  }

  function revealOutcome(outcome){
    outcome.hidden=false;
    outcome.setAttribute('role','status');
    outcome.setAttribute('aria-live','polite');
    outcome.tabIndex=-1;
    outcome.focus({preventScroll:true});
    outcome.scrollIntoView({behavior:'smooth',block:'nearest'});
  }

  document.querySelectorAll('.choice').forEach(button=>{
    button.addEventListener('click',()=>{
      const step=button.closest('.episode-step');
      const outcome=document.getElementById(button.dataset.result);
      if(!step||!outcome||step.dataset.resolved==='true') return;
      const choices=[...step.querySelectorAll('.choice')];
      const outcomes=[...step.querySelectorAll('.outcome')];
      const isCorrect=button.dataset.correct==='true';
      reportEvent('adventure_choice',{scene_number:steps.indexOf(step)+1,correct_choice:isCorrect});
      if(isCorrect){
        step.dataset.resolved='true';
        choices.forEach(choice=>choice.disabled=true);
        outcomes.forEach(result=>result.hidden=true);
        outcome.querySelectorAll('.continue-button').forEach(next=>next.hidden=false);
        completedSteps.add(steps.indexOf(step));
        updateScore();
        saveState();
      }else{
        button.disabled=true;
        if(!outcome.querySelector('.retry-prompt')){
          const prompt=document.createElement('p');
          prompt.className='retry-prompt';
          prompt.textContent='That detour ends here. Pick another choice and keep the story moving.';
          outcome.appendChild(prompt);
        }
      }
      revealOutcome(outcome);
    });
  });

  document.querySelectorAll('.continue-button').forEach(button=>{
    button.addEventListener('click',()=>{
      const step=button.closest('.episode-step');
      if(!step||step.dataset.resolved!=='true') return;
      showStep(steps.indexOf(step)+1);
    });
  });

  document.querySelectorAll('.skill-link').forEach(link=>{
    link.addEventListener('click',()=>{
      const step=link.closest('.episode-step');
      reportEvent('adventure_skill_open',{scene_number:step?steps.indexOf(step)+1:null,skill_path:new URL(link.href,location.href).pathname});
    });
  });

  document.querySelectorAll('.restart-button').forEach(button=>{
    button.addEventListener('click',()=>{
      completedSteps.clear();
      try{
        localStorage.removeItem(storageKey);
        localStorage.removeItem(completionKey);
        sessionStorage.removeItem(storageKey);
        sessionStorage.removeItem(completionKey);
      }catch(_){}
      steps.forEach(step=>{
        delete step.dataset.resolved;
        step.querySelectorAll('.choice').forEach(choice=>choice.disabled=false);
        step.querySelectorAll('.outcome').forEach(outcome=>outcome.hidden=true);
        step.querySelectorAll('.continue-button').forEach(next=>next.hidden=false);
        step.querySelectorAll('.retry-prompt').forEach(prompt=>prompt.remove());
      });
      updateScore();
      showStep(0);
      window.scrollTo({top:0,behavior:'smooth'});
    });
  });

  markVisited();
  addSeasonStatus();
  const saved=readState();
  if(saved){
    saved.completed.forEach(index=>{
      const step=steps[index];
      if(!step||index===steps.length-1) return;
      step.dataset.resolved='true';
      step.querySelectorAll('.choice').forEach(choice=>choice.disabled=true);
      const correct=step.querySelector('.choice[data-correct="true"]');
      const outcome=correct&&document.getElementById(correct.dataset.result);
      if(outcome) outcome.hidden=false;
      completedSteps.add(index);
    });
    updateScore();
    showStep(Number.isInteger(saved.current)?saved.current:0);
  }else{
    updateScore();
    showStep(0);
  }
});
