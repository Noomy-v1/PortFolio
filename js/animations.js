gsap.registerPlugin(ScrollTrigger);

gsap.from('.project-card', {
    scrollTrigger: {
        trigger: '.projects-grid',
        start: 'top 80%',
    },
    opacity: 0,
    y: 30,
    stagger: 0.15,
    duration: 0.8,
});

gsap.from('.skill-group', {
    scrollTrigger: {
        trigger: '.skills-grid',
        start: 'top 80%',
    },
    opacity: 0,
    y: 30,
    stagger: 0.15,
    duration: 0.8,
});