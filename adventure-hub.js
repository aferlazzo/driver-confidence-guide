document.addEventListener('DOMContentLoaded',()=>{
  const seasonKey='dcg-season-1-progress';
  const cards=[...document.querySelectorAll('.coming-soon-card')];
  let progress={completed:[],lastVisited:null};
  try{
    const saved=JSON.parse(localStorage.getItem(seasonKey));
    if(saved&&Array.isArray(saved.completed)) progress=saved;
  }catch(_){}

  const hero=document.querySelector('.welcome-copy');
  if(hero&&cards.length){
    const resume=document.createElement('section');
    resume.className='season-resume';
    const completedCount=progress.completed.length;
    const lastCard=cards.find(card=>{
      const link=card.querySelector('a[href*="adventures/"]');
      return link&&progress.lastVisited&&link.getAttribute('href').includes(`/${progress.lastVisited}/`);
    });
    const nextIncomplete=cards.find(card=>{
      const link=card.querySelector('a[href*="adventures/"]');
      if(!link) return false;
      return !progress.completed.some(slug=>link.getAttribute('href').includes(`/${slug}/`));
    });
    const target=lastCard&&completedCount===0?lastCard:(nextIncomplete||lastCard||cards[0]);
    const targetLink=target&&target.querySelector('a');
    const targetTitle=target&&target.querySelector('h2');
    resume.innerHTML=`<p class="eyebrow">Your Season 1 journey</p><h2>${completedCount?`${completedCount} of ${cards.length} Adventures completed`:'Your first Adventure is waiting'}</h2><p>${completedCount?'Keep following the crew. Each completed story adds another real-world driving skill.':'Start with the crew, make the decisions, and see whether Tyler’s confidence survives contact with reality.'}</p>`;
    if(targetLink&&targetTitle){
      const link=document.createElement('a');
      link.className='hero-button';
      link.href=targetLink.href;
      link.textContent=completedCount?`Continue with ${targetTitle.textContent.trim()}`:`Start ${targetTitle.textContent.trim()}`;
      resume.appendChild(link);
    }
    hero.insertAdjacentElement('afterend',resume);
  }

  cards.forEach(card=>{
    const link=card.querySelector('a[href*="adventures/"]');
    if(!link) return;
    const slug=(link.getAttribute('href').match(/adventures\/([^/]+)\//)||[])[1];
    if(!slug) return;
    if(progress.completed.includes(slug)){
      card.classList.add('is-complete');
      const badge=document.createElement('p');
      badge.className='completion-badge';
      badge.textContent='✓ Adventure completed';
      card.insertBefore(badge,card.firstChild);
      link.textContent='Play Again';
    }else if(progress.lastVisited===slug){
      card.classList.add('is-current');
      const badge=document.createElement('p');
      badge.className='current-badge';
      badge.textContent='Continue here';
      card.insertBefore(badge,card.firstChild);
      link.textContent='Continue Adventure';
    }
  });
});
