document.addEventListener('DOMContentLoaded',()=>{
  const root=document.querySelector('.adventure-v2[data-dcg-shareable="true"]');
  if(!root) return;

  const storageKey=`dcg-adventure:${location.pathname}`;
  const pausedKey=`${storageKey}:paused-at`;
  const canonicalEl=document.querySelector('link[rel="canonical"]');
  const canonicalUrl=canonicalEl?.href||location.href.split('#')[0];
  const title=document.querySelector('h1')?.textContent?.trim()||document.title;
  const status=document.querySelector('.adventure-status');
  const banner=document.querySelector('.adventure-banner');

  function readProgress(){
    try{
      const saved=JSON.parse(localStorage.getItem(storageKey));
      return saved&&Number.isInteger(saved.current)?saved:null;
    }catch(_){return null;}
  }

  function showNotice(message){
    let notice=document.querySelector('.adventure-action-notice');
    if(!notice){
      notice=document.createElement('div');
      notice.className='adventure-action-notice';
      notice.setAttribute('role','status');
      notice.setAttribute('aria-live','polite');
      (status||banner).insertAdjacentElement('afterend',notice);
    }
    notice.textContent=message;
  }

  const toolbar=document.createElement('div');
  toolbar.className='adventure-action-bar';
  toolbar.setAttribute('aria-label','Adventure controls');

  const pause=document.createElement('button');
  pause.type='button';
  pause.className='adventure-action-button';
  pause.textContent='Pause & Save';
  pause.addEventListener('click',()=>{
    try{localStorage.setItem(pausedKey,new Date().toISOString());}catch(_){}
    const progress=readProgress();
    const scene=progress?progress.current+1:null;
    showNotice(scene?`Saved at Scene ${scene}. Close the page whenever you want; this Adventure will resume here on this device.`:'Saved. Close the page whenever you want; this Adventure will resume here on this device.');
  });

  const share=document.createElement('button');
  share.type='button';
  share.className='adventure-action-button';
  share.textContent='Share Adventure';
  share.addEventListener('click',async()=>{
    const data={title, text:`Try this Driver Confidence Guide Adventure: ${title}`, url:canonicalUrl};
    try{
      if(navigator.share){
        await navigator.share(data);
        showNotice('Adventure shared. Your own progress stays on this device.');
      }else if(navigator.clipboard){
        await navigator.clipboard.writeText(canonicalUrl);
        showNotice('Adventure link copied. Your own progress stays on this device.');
      }else{
        showNotice(`Share this link: ${canonicalUrl}`);
      }
    }catch(err){
      if(err?.name!=='AbortError') showNotice(`Share this link: ${canonicalUrl}`);
    }
  });

  toolbar.append(pause,share);
  if(status) status.insertAdjacentElement('afterend',toolbar);
  else banner?.insertAdjacentElement('afterend',toolbar);

  let pausedAt=null;
  try{pausedAt=localStorage.getItem(pausedKey);}catch(_){}
  const progress=readProgress();
  if(pausedAt&&progress&&progress.current>0){
    showNotice(`Welcome back. Your place was saved at Scene ${progress.current+1}.`);
    try{localStorage.removeItem(pausedKey);}catch(_){}
  }

  const ownership=document.createElement('aside');
  ownership.className='adventure-ownership';
  ownership.innerHTML=`<strong>Original Adventure</strong><span>© 2026 Tony Ferlazzo · Driver Confidence Guide</span><a href="${canonicalUrl}" rel="canonical">Canonical copy</a><small>You may share the link freely. Sharing does not transfer authorship or ownership.</small>`;
  root.appendChild(ownership);
});
