// js/modal-voting.js - Afstemning

function voteScandal(scandalId, choice, button) {
  const key = `vote_${scandalId}`;
  let votes = JSON.parse(localStorage.getItem(key) || '{"ja":0,"nej":0,"vedikke":0}');
  
  votes[choice]++;
  localStorage.setItem(key, JSON.stringify(votes));
  
  const parent = button.parentElement;
  const buttons = parent.querySelectorAll('button');
  
  buttons[0].innerHTML = `Godt <span class="font-bold">(${votes.ja})</span>`;
  buttons[1].innerHTML = `Dårligt <span class="font-bold">(${votes.nej})</span>`;
  buttons[2].innerHTML = `Neutral <span class="font-bold">(${votes.vedikke})</span>`;
  
  const originalText = button.innerHTML;
  button.innerHTML = 'Tak!';
  setTimeout(() => {
    button.innerHTML = originalText;
  }, 600);
}