
'use strict';
const form=document.querySelector('form'),status=document.querySelector('#status');
const id=new URLSearchParams(location.search).get('id');
if(/^[a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12}$/i.test(id||''))load();else status.textContent='Lien de formulaire invalide.';
async function load(){
 const endpoint='https://atelier-formation-continue.afloatmound16.chatgpt.site/besoins/formulaire/'+id+'?format=json';
 try{
 const response=await fetch(endpoint);
 const config=await response.json();
 if(!response.ok)throw Error(config.error);
 document.title=config.title;document.querySelector('h1').textContent=config.title;
 status.textContent=[config.description,'Votre réponse sera transmise au responsable de la formation. Évitez les données personnelles dans les champs libres.'].filter(Boolean).join('\n\n');
 function field(title,key,tag,attrs){
 const label=document.createElement('label'),control=document.createElement(tag);
 label.textContent=title;control.name=key;Object.assign(control,attrs);label.append(control);form.append(label);return control;
 }
 field('Département','team','input',{maxLength:120,required:true});
 field('Thème de formation','theme','input',{maxLength:150,required:true});
 const priority=field('Priorité','priority','select',{});
 for(const value of ['Haute','Normale','Basse'])priority.add(new Option(value,value,value==='Normale',value==='Normale'));
 field('Nombre de personnes concernées','people','input',{type:'number',min:1,max:99999,value:1,required:true});
 field('Objectifs ou besoins','objective','textarea',{rows:3,maxLength:1200,required:true});
 config.questions.forEach((title,i)=>field(title,'q'+i,'textarea',{rows:2,maxLength:500}));
 const btn=document.createElement('button');btn.textContent='Envoyer ma réponse';form.append(btn);form.hidden=false;
 const responseId=crypto.randomUUID();
 form.onsubmit=async event=>{event.preventDefault();btn.disabled=true;try{
 const values=new URLSearchParams(new FormData(form));values.set('responseId',responseId);
 const reply=await fetch(endpoint,{method:'POST',body:values});const result=await reply.json();if(!reply.ok||!result.saved)throw Error(result.error||'Envoi impossible.');
 form.hidden=true;document.querySelector('h1').textContent='Réponse enregistrée';status.textContent='Merci pour votre contribution.';
 }catch(error){status.textContent=error.message||'Envoi impossible.'}finally{btn.disabled=false}};
 }catch(error){status.textContent=error.message||'Formulaire indisponible.'}
}

