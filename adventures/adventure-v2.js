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
      step.querySelectorAll('.choice').forEach(choice=>choice.disabled=true);
      const outcome=document.getElementById(button.dataset.result);
      outcome.hidden=false;
      if(button.dataset.correct==='true'){
        score+=1;
        scoreText.textContent=score;
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
      });
      showStep(0);
      window.scrollTo({top:0,behavior:'smooth'});
    });
  });

  showStep(0);
});
