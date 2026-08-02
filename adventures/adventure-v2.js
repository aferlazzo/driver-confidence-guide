document.addEventListener('DOMContentLoaded',()=>{
  const steps=[...document.querySelectorAll('.episode-step')];
  const fill=document.querySelector('.progress-fill');
  const status=document.querySelector('.scene-status');
  const scoreText=document.querySelector('.score-value');
  const finalScore=document.querySelector('.final-score-value');
  const completedSteps=new Set();
  const storageKey=`dcg-adventure:${location.pathname}`;
  let current=0;

  function saveState(){
    try{
      sessionStorage.setItem(storageKey,JSON.stringify({
        current,
        completed:[...completedSteps]
      }));
    }catch(_){
      // The Adventure still works when private-browser storage is unavailable.
    }
  }

  function readState(){
    try{
      const saved=JSON.parse(sessionStorage.getItem(storageKey));
      if(!saved||!Array.isArray(saved.completed)) return null;
      return saved;
    }catch(_){
      return null;
    }
  }

  function updateScore(){
    const score=completedSteps.size;
    scoreText.textContent=score;
    if(finalScore) finalScore.textContent=score;
  }

  function showStep(index){
    const safeIndex=Math.max(0,Math.min(index,steps.length-1));
    steps.forEach((step,i)=>step.classList.toggle('is-active',i===safeIndex));
    current=safeIndex;
    const isFinish=safeIndex===steps.length-1;
    const decisionCount=steps.length-1;
    status.textContent=isFinish?'Adventure complete':`Scene ${safeIndex+1} of ${decisionCount}`;
    fill.style.width=`${Math.min(100,((safeIndex+1)/steps.length)*100)}%`;
    updateScore();
    saveState();
    if(isFinish){
      document.querySelector('.adventure-status').scrollIntoView({behavior:'smooth',block:'start'});
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
        outcome.querySelectorAll('.continue-button').forEach(next=>next.hidden=true);
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

  document.querySelectorAll('.restart-button').forEach(button=>{
    button.addEventListener('click',()=>{
      completedSteps.clear();
      try{sessionStorage.removeItem(storageKey);}catch(_){}
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
