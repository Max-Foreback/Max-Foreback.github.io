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

<p class="lede">I'm a third year student at Michigan State University earning my dual PhD in Computer Science and Ecology, Evolution, and Behavior. I'm a member of the Evolutionary Control of Digital Ecologies lab, advised by the amazing <a href="https://cse.msu.edu/~dolsonem/">Emily Dolson</a>. Below are some of my selected projects:</p>

## Evolutionary swarm robotics

I received the [NSF GRFP](https://www.nsfgrfp.org/) in 2024 to study the impacts of different substrates and selection schemes on the evolution of swarms. This work is ongoing, with the first publication recently accepted at IEEE SSCI 2025! We show that Markov Brains and Cartesian Genetic Programming can be used to control agents in swarms, along with the traditional Neural Networks. Swarms can even be composed of multiple types of controllers to facilitate specialization! Further work will expand by including more controller types, more complex tasks, and more selection schemes. Made possible by [MABE](https://github.com/Hintzelab/MABE) and with help from [Clifford Bohm](https://cliffbohm.weebly.com/).

<figure class="figure">
  <img src="{{ '/images/graphviz.svg' | relative_url }}" alt="An evolved Markov Brain visualized as a node graph">
  <figcaption>One of my evolved Markov brains, visualized with <a href="https://graphviz.org/">graphviz</a>.</figcaption>
</figure>

## The GENETIS project

The Genetically Evolved NEutrino Telescopes for Improved Sensitivity (GENETIS) project, led by Amy Connolly and Julie Rolla, and in collaboration with NASA's [Jet Propulsion Laboratory](https://www.jpl.nasa.gov/) and Ohio State University, is a genetic algorithm which evolves antennas to detect ultra high energy neutrinos from deep space. I recently began working to improve the evolutionary computation side of this project — the rest is left to a very talented team of physicists and engineers.

<div class="figure-row">
  <img src="{{ '/images/NASA_logo.png' | relative_url }}" alt="NASA logo">
  <img src="{{ '/images/ohio.png' | relative_url }}" alt="Ohio State University logo">
</div>

## The ecology–evolution continuum and the origin of life

Since I started my PhD, I've been working with [Emily Dolson](https://cse.msu.edu/~dolsonem/), [Sydney Leither](https://scholar.google.com/citations?user=BzcWiSgAAAAJ&hl=en), and the [Baum lab](https://baumlab.botany.wisc.edu/) to investigate pre-genetic adaptive change. While the Baum lab does some super interesting lab work, I work on the computational side, modeling systems that could be representative of the early interactions of pre-biotic chemicals. A great in-depth summary of this framework can be found in *The ecology–evolution continuum and the origin of life* by Baum et al. 2023.

<figure class="figure">
  <img src="{{ '/images/eco-evo.jpg' | relative_url }}" alt="Diagram comparing cellular and ecosystem evolution">
  <figcaption>One of my favorite figures from the aforementioned paper, showing "a comparison of cellular (a) and ecosystem evolution (b)."</figcaption>
</figure>

## Emergence and information theory

Working with Clifford Bohm and Vincent Ragusa, we're developing a new theory of emergence. This paper might eventually see the light of day.

<figure class="figure">
  <img src="{{ '/images/math.JPG' | relative_url }}" alt="A hand-written derivation" style="max-width: 320px;">
</figure>
