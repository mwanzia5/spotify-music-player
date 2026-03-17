import type { Metadata } from "next";
import "./globals.css";

import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MambaLabs Music Player",
  description: "Spotify-style music player built with MambaLabs",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className={`${inter.className} bg-black text-white`}>
        {children}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){
  if(window.__mambaInspectorActive)return;
  window.__mambaInspectorActive=true;

  var s=document.createElement('style');
  s.textContent=[
    '.__mamba_hover{outline:2px dashed #6366f1 !important;outline-offset:2px !important;cursor:crosshair !important}',
    '.__mamba_selected{outline:2px solid #ef4444 !important;outline-offset:2px !important}',
    '.__mamba_editing{outline:2px solid #10b981 !important;outline-offset:2px !important;cursor:text !important;caret-color:#10b981}'
  ].join('');
  document.head.appendChild(s);

  var hov=null,sel=null,editing=null,clickTimer=null,clickTarget=null;

  function gs(el){
    if(!el||el===document.body)return'body';
    var t=el.tagName.toLowerCase(),
        id=el.id?'#'+el.id:'',
        cl=Array.from(el.classList).filter(function(c){return!c.startsWith('__mamba')}).slice(0,2).map(function(c){return'.'+c}).join('');
    return t+id+cl;
  }

  function stopEditing(){
    if(!editing)return;
    editing.contentEditable='false';
    editing.classList.remove('__mamba_editing');
    editing=null;
    document.body.style.cursor='';
  }

  function doSelect(el){
    if(sel)sel.classList.remove('__mamba_selected','__mamba_hover');
    sel=el;
    sel.classList.add('__mamba_selected');
    var tag=sel.tagName.toLowerCase();
    window.parent.postMessage({
      type:'ELEMENT_SELECTED',
      payload:{
        tag:tag,
        classes:Array.from(sel.classList).filter(function(c){return!c.startsWith('__mamba')}).join(' '),
        text:(sel.textContent||'').trim().slice(0,80),
        selector:gs(sel),
        isImage:tag==='img',
        src:tag==='img'?sel.getAttribute('src'):null
      }
    },'*');
  }

  function doEdit(el,x,y){
    var tag=el.tagName.toLowerCase();
    var textTags=['p','h1','h2','h3','h4','h5','h6','span','a','li','td','th','label','button','div'];
    if(textTags.indexOf(tag)===-1)return;
    stopEditing();
    editing=el;
    editing.contentEditable='true';
    editing.classList.remove('__mamba_hover','__mamba_selected');
    editing.classList.add('__mamba_editing');
    editing.focus();
    var range=document.caretRangeFromPoint?document.caretRangeFromPoint(x,y):null;
    if(range){var s2=window.getSelection();s2.removeAllRanges();s2.addRange(range);}
    window.parent.postMessage({type:'EDITING_STARTED',payload:{selector:gs(el)}},'*');
  }

  document.addEventListener('mouseover',function(e){
    if(editing)return;
    if(hov&&hov!==sel)hov.classList.remove('__mamba_hover');
    hov=e.target;
    if(hov!==sel)hov.classList.add('__mamba_hover');
  },true);

  document.addEventListener('mouseout',function(e){
    if(editing)return;
    if(e.target!==sel)e.target.classList.remove('__mamba_hover');
  },true);

  document.addEventListener('click',function(e){
    if(editing){
      if(e.target!==editing){stopEditing();window.parent.postMessage({type:'EDITING_STOPPED'},'*');}
      return;
    }
    if(clickTimer){clearTimeout(clickTimer);clickTimer=null;}
    clickTarget=e.target;
    clickTimer=setTimeout(function(){clickTimer=null;doSelect(clickTarget);},200);
  },true);

  document.addEventListener('dblclick',function(e){
    if(clickTimer){clearTimeout(clickTimer);clickTimer=null;}
    e.preventDefault();
    e.stopPropagation();
    if(editing===e.target)return;
    doEdit(e.target,e.clientX,e.clientY);
  },true);

  document.addEventListener('keydown',function(e){
    if(e.key==='Escape'&&editing){
      stopEditing();
      window.parent.postMessage({type:'EDITING_STOPPED'},'*');
    }
  },true);

  window.addEventListener('message',function(e){
    if(e.data.type==='APPLY_STYLE_SELECTOR'){var el=document.querySelector(e.data.selector);if(el)el.style[e.data.property]=e.data.value;}
    if(e.data.type==='APPLY_CLASS_ADD'){var el=document.querySelector(e.data.selector);if(el)el.classList.add(e.data.cls);}
    if(e.data.type==='APPLY_CLASS_REMOVE'){var el=document.querySelector(e.data.selector);if(el)el.classList.remove(e.data.cls);}
    if(e.data.type==='APPLY_SRC'){var el=document.querySelector(e.data.selector);if(el)el.setAttribute('src',e.data.value);}
    if(e.data.type==='APPLY_ATTR'){var el=document.querySelector(e.data.selector);if(el)el.setAttribute(e.data.attr,e.data.value);}
    if(e.data.type==='CLEAR_SELECTION'){stopEditing();if(sel){sel.classList.remove('__mamba_selected');sel=null;}}
    if(e.data.type==='AUTO_SELECT_FIRST_IMAGE'){
      var img=document.querySelector('img');
      if(img){
        if(sel)sel.classList.remove('__mamba_selected','__mamba_hover');
        sel=img;sel.classList.add('__mamba_selected');
        window.parent.postMessage({type:'ELEMENT_SELECTED',payload:{
          tag:'img',
          classes:Array.from(img.classList).filter(function(c){return!c.startsWith('__mamba')}).join(' '),
          text:'',selector:gs(img),isImage:true,src:img.getAttribute('src')
        }},'*');
      }
    }
  });

  window.parent.postMessage({type:'INSPECTOR_READY'},'*');
})();`,
          }}
        />
      </body>
    </html>
  );
}
