const dialog = document.querySelector('#art-dialog');
document.querySelectorAll('.art').forEach(button => button.addEventListener('click', () => {
 const frame=document.querySelector('#full-art-frame');
 frame.classList.toggle('illustration-frame',Boolean(button.dataset.offset));
 frame.style.setProperty('--art-offset',button.dataset.offset || '0%');
 frame.style.setProperty('--art-ratio',button.dataset.ratio || '1');
 document.querySelector('#full-art').src = button.dataset.image;
 document.querySelector('#full-art').alt = button.querySelector('img').alt;
 const pop=document.querySelector('.art-pop');
 pop.style.animation='none';
 dialog.showModal();
 void pop.offsetWidth;
 pop.style.animation='';
}));
document.querySelector('#close-art').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });

const collections = [...document.querySelectorAll('.collection')];
collections.forEach(collection => collection.addEventListener('toggle', () => {
 if (collection.open) collections.forEach(other => { if (other !== collection) other.open = false; });
}));

document.querySelectorAll('.video-collection').forEach(collection => collection.addEventListener('toggle', () => {if (!collection.open) collection.querySelectorAll('video').forEach(video => video.pause());}));
