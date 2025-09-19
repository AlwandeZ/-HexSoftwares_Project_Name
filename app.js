let menu= document.querySelector('#menu-icon');
let navbar= document.querySelector('.navbar');

menu.onClick = () => {

  menu.classList.toggle('bx-x');
  navbar.classList.toggle('active');

}
windows.onScroll = () => {

  menu.classList.remove('bx-x');
  navbar.classList.remove('active');

}
const typed = new Typed('.multiple-text',{
      strings: ['Weightlifting','Cardio &Strength','Power Yoga','Fitness pack'],
      typeSpeed: 60,
      backSpeen:60,
      backDelay:1000,
      loop:true

    });