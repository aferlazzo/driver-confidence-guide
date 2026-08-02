document.addEventListener('DOMContentLoaded',()=>{
  const steps=[...document.querySelectorAll('.episode-step')];
  const fill=document.querySelector('.progress-fill');
  const status=document.querySelector('.scene-status');
  const scoreText=document.querySelector('.score-value');
  const finalScore=document.querySelector('.final-score-value');
  let current=0;
  let score=0;

  function showStep(index){
    steps.forEach((step,i)=>step.classList.toggle('is-active',i===index));
    current=index;
    const isFinish=index===steps.length-1;
    const decisionCount=steps.length-1;
    status.textContent=isFinish?'Adventure complete':`Scene ${index+1} of ${decisionCount}`;
    fill.style.width=`${Math.min(100,((index+1)/steps.length)*100)}%`;
    if(isFinish){
      finalScore.textContent=score;
      document.querySelector('.adventure-status').scrollIntoView({behavior:'smooth',block:'start'});
    }
  }

  document.querySelectorAll('.choice').forEach(button=>{
    button.addEventListener('click',()=>{
      const step=button.closest('.episode-step');
      const choices=[...step.querySelectorAll('.choice')];
      const outcomes=[...step.querySelectorAll('.outcome')];
      const outcome=document.getElementById(button.dataset.result);
      const isCorrect=button.dataset.correct==='true';

      if(isCorrect){
        choices.forEach(choice=>choice.disabled=true);
        outcomes.forEach(result=>result.hidden=true);
        outcome.hidden=false;
        score+=1;
        scoreText.textContent=score;
      }else{
        button.disabled=true;
        outcome.hidden=false;
        outcome.querySelectorAll('.continue-button').forEach(next=>next.hidden=true);
        if(!outcome.querySelector('.retry-prompt')){
          const prompt=document.createElement('p');
          prompt.className='retry-prompt';
          prompt.textContent='That detour ends here. Pick another choice and keep the story moving.';
          outcome.appendChild(prompt);
        }
      }
      outcome.scrollIntoView({behavior:'smooth',block:'nearest'});
    });
  });

  document.querySelectorAll('.continue-button').forEach(button=>{
    button.addEventListener('click',()=>showStep(current+1));
  });

  document.querySelectorAll('.restart-button').forEach(button=>{
    button.addEventListener('click',()=>{
      score=0;
      scoreText.textContent='0';
      steps.forEach(step=>{
        step.querySelectorAll('.choice').forEach(choice=>choice.disabled=false);
        step.querySelectorAll('.outcome').forEach(outcome=>outcome.hidden=true);
        step.querySelectorAll('.continue-button').forEach(next=>next.hidden=false);
        step.querySelectorAll('.retry-prompt').forEach(prompt=>prompt.remove());
      });
      showStep(0);
      window.scrollTo({top:0,behavior:'smooth'});
    });
  });

  showStep(0);
});
