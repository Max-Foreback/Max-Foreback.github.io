---
permalink: /
redirect_from:
  - /about/
  - /about.html
---

<div class="intro">
  <img class="intro-avatar" src="{{ '/images/me.jpg' | relative_url }}" alt="{{ site.author.name }}">
  <div class="intro-text">
    <h1 class="intro-name">{{ site.author.name }}</h1>
    <p class="intro-meta">{{ site.author.bio }} &middot; {{ site.author.employer }}<br>{{ site.author.location }}</p>
  </div>
</div>

<p class="lede">I'm a PhD student at Michigan State University, pursuing a dual PhD in Computer Science and Ecology, Evolution, and Behavior, advised by <a href="https://cse.msu.edu/~dolsonem/">Emily Dolson</a>. My focus has shifted toward hardware design: I'm now the primary software developer and dev-team lead for <a href="https://www.nebulous-design.org/">Nebulous</a>, evolving real spacecraft and instrument hardware. Evolutionary swarm robotics and digital-evolution theory were where I started, and are still active side interests.</p>

## Current work

<div class="project-card project-card--feature">
  <div class="project-card__media">
    <div class="evo-placeholder" aria-hidden="true">
      <span></span><span></span><span></span><span></span><span></span><span></span><span></span>
    </div>
    <p class="media-note">Placeholder — real GIFs of individuals evolving over generations go here.</p>
  </div>
  <div class="project-card__body">
    <h3>Nebulous &amp; ECLIPSE</h3>
    <p>Nebulous is a research collaboration (NASA JPL, Michigan State, Ohio State, CU Boulder, and others) using evolutionary algorithms, AI, and physics-based simulation to design next-generation science hardware &mdash; antennas, spacecraft, and deployable structures that are high-performing, buildable, and mission-relevant. I lead development of <strong>ECLIPSE</strong>, the evolutionary computation framework the whole project runs on, and the small dev team building it.</p>
    <p>Active sub-projects include <strong>SOAR</strong> (spacecraft aerodynamics in very low Earth orbit), <strong>FACET</strong> (antenna geometry optimization), <strong>LEO</strong> (antenna arrays), and <strong>ORIGAMI</strong> (deployable structures).</p>
    <p><a href="https://www.nebulous-design.org/">nebulous-design.org &rarr;</a></p>
  </div>
</div>

## Past work

<div class="project-grid">
  <div class="project-card">
    <div class="project-card__media">
      <img src="{{ '/images/graphviz.svg' | relative_url }}" alt="An evolved Markov Brain visualized as a node graph">
    </div>
    <div class="project-card__body">
      <h3>Evolutionary swarm robotics</h3>
      <p>Studied how substrate and selection scheme shape the evolution of swarms &mdash; Markov Brains, Cartesian Genetic Programming, and neural networks as interchangeable (and mixable) swarm controllers, evolved with <a href="https://github.com/Hintzelab/MABE">MABE</a>. Funded by an <a href="https://www.nsfgrfp.org/">NSF GRFP</a>; first publication at IEEE SSCI 2025.</p>
    </div>
  </div>

  <div class="project-card">
    <div class="project-card__media">
      <div class="figure-row figure-row--card">
        <img src="{{ '/images/NASA_logo.png' | relative_url }}" alt="NASA logo">
        <img src="{{ '/images/ohio.png' | relative_url }}" alt="Ohio State University logo">
      </div>
    </div>
    <div class="project-card__body">
      <h3>GENETIS</h3>
      <p>Worked on the evolutionary-computation side of GENETIS, a genetic algorithm (led by Amy Connolly and Julie Rolla, with NASA JPL and Ohio State) that evolves antennas to detect ultra-high-energy neutrinos from deep space.</p>
    </div>
  </div>

  <div class="project-card">
    <div class="project-card__media">
      <img src="{{ '/images/eco-evo.jpg' | relative_url }}" alt="Diagram comparing cellular and ecosystem evolution">
    </div>
    <div class="project-card__body">
      <h3>The ecology&ndash;evolution continuum</h3>
      <p>With Emily Dolson, Sydney Leither, and the Baum lab, modeled pre-genetic adaptive change &mdash; computational systems representative of early interactions between pre-biotic chemicals. See <em>The ecology&ndash;evolution continuum and the origin of life</em>, Baum et al. 2023.</p>
    </div>
  </div>

  <div class="project-card">
    <div class="project-card__media">
      <img src="{{ '/images/math.JPG' | relative_url }}" alt="A hand-written derivation">
    </div>
    <div class="project-card__body">
      <h3>Emergence &amp; information theory</h3>
      <p>With Clifford Bohm and Vincent Ragusa, developing a new theory of emergence. This paper might eventually see the light of day.</p>
    </div>
  </div>
</div>
