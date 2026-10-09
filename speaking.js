/* =====================================================================
   SOLO LEVELING — SPEAKING TRAINING
   Pronunciation practice for Arabic speakers learning English.
   Integrates with the XP system: +5 XP per word, +10 XP per recording.
   ===================================================================== */

/* ---------------------------------------------------------------------
   DATA — tools, words, sounds, sentences, plans
   --------------------------------------------------------------------- */
const SPEAKING_DATA = {

  /* External pronunciation tools */
  tools: [
    { name:'YouGlish', url:'https://youglish.com', desc:'Search any word or phrase and hear it spoken in real YouTube videos.', icon:'Y' },
    { name:'Forvo', url:'https://forvo.com', desc:'The largest pronunciation dictionary — native speakers pronounce every word.', icon:'F' },
    { name:'ELSA Speak', url:'https://elsaspeak.com', desc:'AI pronunciation coach. Real-time feedback on your speech.', icon:'E' }
  ],

  /* Difficult words for performance marketing — phonetic + common mistake */
  words: [
    { id:'w1',  word:'pronunciation',    phonetic:'/prəˌnʌnsiˈeɪʃən/',  mistake:'Stress the second syllable (pruh-NUN-see-AY-shun), not the first.', example:'Your pronunciation of "campaign" has improved.' },
    { id:'w2',  word:'phonetic',         phonetic:'/fəˈnɛtɪk/',         mistake:'The "ph" is /f/, not /p/. Stress is on the second syllable.', example:'The phonetic transcription shows the vowel sounds.' },
    { id:'w3',  word:'transcription',    phonetic:'/trænˈskrɪpʃən/',   mistake:'The "tion" ending is /ʃən/, not /ziːɒn/ or /ʃɪn/.', example:'I wrote a transcription of the meeting.' },
    { id:'w4',  word:'optimization',     phonetic:'/ˌɒptɪmaɪˈzeɪʃən/',  mistake:'Stress on the fourth syllable (op-ti-my-ZAY-shun).', example:'Campaign optimization is a daily task.' },
    { id:'w5',  word:'allocation',       phonetic:'/ˌæləˈkeɪʃən/',      mistake:'The "a" in the second syllable is /ə/ (schwa), not /æ/.', example:'Budget allocation across channels is tricky.' },
    { id:'w6',  word:'attribution',      phonetic:'/ˌætrɪˈbjuːʃən/',    mistake:'Stress the third syllable (at-tri-BYOO-shun).', example:'Attribution models help us understand the customer journey.' },
    { id:'w7',  word:'demographics',     phonetic:'/ˌdɛməˈɡræfɪks/',    mistake:'The "de" at the start is /də/ or /dɛ/, not /diː/.', example:'The target demographics are 18–34 year olds.' },
    { id:'w8',  word:'psychographics',   phonetic:'/ˌsaɪkəˈɡræfɪks/',   mistake:'The "psy" is /saɪ/, not /psiː/ or /sɪk/.', example:'Psychographics reveal attitudes and values.' },
    { id:'w9',  word:'remarketing',      phonetic:'/ˌriːˈmɑːrkɪtɪŋ/',   mistake:'Stress the SECOND syllable (ree-MAR-ket-ing), not the first.', example:'Remarketing brings back visitors who did not convert.' },
    { id:'w10', word:'retargeting',      phonetic:'/ˌriːˈtɑːrɡɪtɪŋ/',   mistake:'Similar to remarketing — stress the second syllable.', example:'Retargeting campaigns usually have higher CTR.' },
    { id:'w11', word:'segmentation',     phonetic:'/ˌsɛɡmənˈteɪʃən/',   mistake:'The "men" is /mən/, not /meɪn/ or /mɛn/.', example:'Audience segmentation improves conversion rates.' },
    { id:'w12', word:'benchmark',        phonetic:'/ˈbɛntʃmɑːrk/',       mistake:'Only two syllables (BENCH-mark), not three.', example:'What is the industry benchmark for CTR?' },
    { id:'w13', word:'engagement',       phonetic:'/ɪnˈɡeɪdʒmənt/',     mistake:'Stress the second syllable (in-GAGE-ment).', example:'Engagement rate matters more than follower count.' },
    { id:'w14', word:'conversion',       phonetic:'/kənˈvɜːrʒən/',      mistake:'Stress the second syllable (con-VER-zhun), not the first.', example:'The conversion rate doubled last month.' },
    { id:'w15', word:'revenue',          phonetic:'/ˈrɛvənuː/',          mistake:'Three syllables (REV-enn-yoo), not two. The "e" is /ɛ/.', example:'Revenue grew 18% quarter on quarter.' },
    { id:'w16', word:'analytics',        phonetic:'/ˌænəˈlɪtɪks/',      mistake:'Stress the third syllable (an-uh-LIT-iks).', example:'Google Analytics shows the traffic sources.' },
    { id:'w17', word:'impression',       phonetic:'/ɪmˈprɛʃən/',        mistake:'Stress the second syllable (im-PRESS-ion).', example:'The ad received 50,000 impressions.' },
    { id:'w18', word:'funnel',           phonetic:'/ˈfʌnəl/',            mistake:'Two syllables (FUN-nel), not three. The "u" is /ʌ/.', example:'The marketing funnel has five stages.' },
    { id:'w19', word:'milestone',        phonetic:'/ˈmaɪlstoʊn/',        mistake:'Stress the first syllable (MILE-stone).', example:'Hitting 10,000 leads was a real milestone.' },
    { id:'w20', word:'collaborate',      phonetic:'/kəˈlæbəreɪt/',       mistake:'Stress the second syllable (col-LAB-orate), not the first.', example:'The design team collaborates with media buyers.' },
    { id:'w21', word:'funnel',           phonetic:'/ˈfʌnəl/',            mistake:'Two syllables (FUN-nel), not three. The "u" is /ʌ/.', example:'The marketing funnel has five stages.' },
    { id:'w22', word:'milestone',        phonetic:'/ˈmaɪlstoʊn/',        mistake:'Stress the first syllable (MILE-stone).', example:'Hitting 10,000 leads was a real milestone.' },
    { id:'w23', word:'attribution',      phonetic:'/ˌætrɪˈbjuːʃən/',     mistake:'Stress the third syllable (at-tri-BYOO-shun).', example:'Attribution models help us understand the customer journey.' },
    { id:'w24', word:'psychographics',   phonetic:'/ˌsaɪkəˈɡræfɪks/',    mistake:'The "psy" is /saɪ/, not /psiː/ or /sɪk/.', example:'Psychographics reveal attitudes and values.' },
    { id:'w25', word:'remarketing',      phonetic:'/ˌriːˈmɑːrkɪtɪŋ/',    mistake:'Stress the SECOND syllable (ree-MAR-ket-ing), not the first.', example:'Remarketing brings back visitors who did not convert.' },
    { id:'w26', word:'segmentation',     phonetic:'/ˌsɛɡmənˈteɪʃən/',    mistake:'The "men" is /mən/, not /meɪn/ or /mɛn/.', example:'Audience segmentation improves conversion rates.' },
    { id:'w27', word:'benchmark',        phonetic:'/ˈbɛntʃmɑːrk/',        mistake:'Only two syllables (BENCH-mark), not three.', example:'What is the industry benchmark for CTR?' },
    { id:'w28', word:'engagement',       phonetic:'/ɪnˈɡeɪdʒmənt/',      mistake:'Stress the second syllable (in-GAGE-ment).', example:'Engagement rate matters more than follower count.' },
    { id:'w29', word:'conversion',       phonetic:'/kənˈvɜːrʒən/',       mistake:'Stress the second syllable (con-VER-zhun), not the first.', example:'The conversion rate doubled last month.' },
    { id:'w30', word:'revenue',          phonetic:'/ˈrɛvənuː/',           mistake:'Three syllables (REV-enn-yoo), not two. The "e" is /ɛ/.', example:'Revenue grew 18% quarter on quarter.' },
    { id:'w31', word:'analytics',        phonetic:'/ˌænəˈlɪtɪks/',       mistake:'Stress the third syllable (an-uh-LIT-iks).', example:'Google Analytics shows the traffic sources.' },
    { id:'w32', word:'impression',       phonetic:'/ɪmˈprɛʃən/',         mistake:'Stress the second syllable (im-PRESS-ion).', example:'The ad received 50,000 impressions.' },
    { id:'w33', word:'programmatic',    phonetic:'/ˌproʊɡrəˈmætɪk/',    mistake:'Stress the third syllable (pro-gram-MAT-ic).', example:'Programmatic buying automates ad placement.' },
    { id:'w34', word:'viewability',      phonetic:'/ˌvjuːəˈbɪləti/',      mistake:'Stress the second syllable (view-AB-il-ity).', example:'Viewability measures if the ad was actually seen.' },
    { id:'w35', word:'frequency',        phonetic:'/ˈfriːkwənsi/',        mistake:'Stress the first syllable (FRE-quen-cy).', example:'Frequency capping prevents ad fatigue.' },
    { id:'w36', word:'lookalike',        phonetic:'/ˈlʊkəlaɪk/',          mistake:'Stress the first syllable (LOOK-a-like).', example:'Lookalike audiences find similar users.' },
    { id:'w37', word:'bid strategy',     phonetic:'/ˈbɪd ˌstrætədʒi/',    mistake:'Two words: BID STRATEGY. Stress both.', example:'Bid strategy determines how much you pay per click.' },
    { id:'w38', word:'landing page',     phonetic:'/ˈlændɪŋ ˌpeɪdʒ/',     mistake:'Two words: LANDING PAGE. Stress the first of each.', example:'The landing page must match the ad promise.' },
    { id:'w39', word:'call to action',   phonetic:'/ˈkɔːl tuː ˈækʃən/',   mistake:'Three words: CALL TO ACTION. Stress CALL and AC-.', example:'A clear call to action improves conversion rates.' },
    { id:'w40', word:'cost per lead',    phonetic:'/ˈkɔːst pər ˈliːd/',   mistake:'Three words: COST PER LEAD. Stress COST and LEAD.', example:'Our cost per lead dropped to 15 Turkish lira.' }
  ],

  /* Difficult sounds for Arabic speakers — minimal pairs */
  sounds: [
    { id:'s1', pair:'/p/ vs /b/', desc:'Arabic lacks /p/, so it is often replaced with /b/.', pWords:['park','pin','cup','price'], bWords:['bark','bin','cub','brice'], tip:'Press your lips together firmly for /p/. For /b/, the lips are the same but the voice is on.' },
    { id:'s2', pair:'/v/ vs /f/', desc:'Arabic lacks /v/, so it is often replaced with /f/.', vWords:['very','van','vest','vote'], fWords:['ferry','fan','fest','boat'], tip:'For /v/, touch your top teeth to your bottom lip and vibrate. For /f/, same position but no voice.' },
    { id:'s3', pair:'/g/ vs /k/', desc:'Both exist in Arabic, but /g/ is sometimes replaced with /k/ in certain positions.', gWords:['go','game','gold','big'], kWords:['coat','came','cold','back'], tip:'For /g/, the back of the tongue touches the soft palate with voice. For /k/, same position but no voice.' },
    { id:'s4', pair:'/tʃ/ vs /sh/', desc:'The /tʃ/ sound (as in "chair") does not exist in Arabic.', tchWords:['chair','chips','lunch','watch'], shWords:['share','ships','wash','cash'], tip:'For /tʃ/, start with /t/ and release into /sh/. For /sh/, the tongue is further back.' },
    { id:'s5', pair:'/θ/ vs /s/', desc:'The /θ/ sound (as in "think") does not exist in Arabic and is often replaced with /s/.', thWords:['think','thank','thick','path'], sWords:['sink','sank','sick','pass'], tip:'Put your tongue between your teeth and blow air for /θ/. For /s/, the tongue is behind the teeth.' },
    { id:'s6', pair:'/ð/ vs /d/', desc:'The /ð/ sound (as in "this") does not exist in Arabic and is often replaced with /d/.', thWords:['this','that','breathe','other'], dWords:['dis','dat','breed','udder'], tip:'Same tongue position as /θ/ (between teeth) but with voice for /ð/. For /d/, the tongue touches the ridge behind the teeth.' }
  ],

  /* Practice sentences organized by sound group */
  sentences: [
    { id:'sent1', group:'/p/ vs /b/', sentences:[
      'The park was full of people playing ball.',
      'Buy the pen, not the pencil.',
      'The baby is sleeping in the crib.',
      'We need a better plan for the product launch.'
    ]},
    { id:'sent2', group:'/v/ vs /f/', sentences:[
      'The very best ads are visually fresh.',
      'We value honest feedback from the team.',
      'The vote was verified by the finance staff.',
      'Five verticals drove the most volume.'
    ]},
    { id:'sent3', group:'/g/ vs /k/', sentences:[
      'The goal is to grow by the second quarter.',
      'We gave the new creative a good score.',
      'The gold campaign began with a kickoff.',
      'Big ideas need careful calculation.'
    ]},
    { id:'sent4', group:'/tʃ/ vs /sh/', sentences:[
      'The chair of the board chose the channel mix.',
      'We watched the engagement chart reach new heights.',
      'The team lunched and chatted about the strategy.',
      'Share the chips, not the chocolate, with the children.'
    ]},
    { id:'sent5', group:'/θ/ vs /s/', sentences:[
      'I think the theory worth the thinking is thorough.',
      'Thanks for thinking through the conversion math.',
      'The thick report on sales was thoughtful.',
      'The north path has the most foot traffic.'
    ]},
    { id:'sent6', group:'/ð/ vs /d/', sentences:[
      'This method is better than the other approach.',
      'The weather in December is rather mild.',
      'Breathe deeply before you either answer or ask.',
      'My mother and brother gathered together.'
    ]},
    { id:'sent7', group:'Client meeting sentences', sentences:[
      'Our cost per lead decreased from 25 to 15 Turkish lira over three months.',
      'The client wants to increase the budget for the next campaign.',
      'I recommend we focus on lookalike audiences for this product.',
      'The landing page needs a stronger call to action to improve conversions.',
      'We should test three different ad creatives before scaling the budget.'
    ]},
    { id:'sent8', group:'Interview and career sentences', sentences:[
      'I managed over 27 performance campaigns across multiple industries.',
      'My background in media buying helps me understand the full funnel.',
      'I am comfortable presenting results to clients and stakeholders.',
      'I use analytics to make data-driven decisions every day.',
      'I am looking for a role where I can grow and contribute to the team.'
    ]},
    { id:'sent9', group:'Advanced marketing terms', sentences:[
      'Programmatic buying allows us to reach specific audiences at scale.',
      'Viewability is becoming a major concern for brand safety.',
      'Frequency capping prevents users from seeing the same ad too often.',
      'The attribution model shows which channels drive the most conversions.',
      'A higher bid strategy can improve our ad placement and reach.'
    ]}
  ],

  /* 15-minute daily training plan */
  dailyPlan: [
    { time:'0:00 – 3:00',   title:'Warm-up',           desc:'Review yesterday\'s words. Say each one three times, slowly.' },
    { time:'3:00 – 7:00',   title:'Difficult Sounds',   desc:'Pick one sound pair. Practice minimal pairs slowly, then at normal speed.' },
    { time:'7:00 – 11:00',  title:'Word Practice',      desc:'Take 3 difficult words. Use each in a sentence. Record yourself saying them.' },
    { time:'11:00 – 14:00', title:'Sentence Practice',  desc:'Read the practice sentences for today\'s sound group. Focus on accuracy.' },
    { time:'14:00 – 15:00', title:'Record & Review',    desc:'Record all 3 words + 1 sentence. Listen back and compare with the model.' }
  ],

  /* 4-week schedule */
  weeks: [
    { week:1, title:'Foundation', focus:'/p/ vs /b/, /v/ vs /f/', tasks:[
      'Practice minimal pairs for /p/ and /b/ daily',
      'Learn the lip position for /v/ vs /f/',
      'Practice 5 difficult words with recordings',
      'Use YouGlish to hear words in real context'
    ]},
    { week:2, title:'Building', focus:'/g/ vs /k/, /tʃ/ vs /sh/', tasks:[
      'Practice /g/ and /k/ minimal pairs',
      'Master /tʃ/ (chair) vs /sh/ (share)',
      'Record yourself reading full sentences',
      'Start using Forvo to check unfamiliar words'
    ]},
    { week:3, title:'Consolidation', focus:'/θ/ vs /s/, /ð/ vs /d/', tasks:[
      'Practice /θ/ (think) vs /s/ (sink)',
      'Master /ð/ (this) vs /d/ (dis)',
      'Complete the full 15-minute daily plan',
      'Review all difficult words from weeks 1–2'
    ]},
    { week:4, title:'Mastery', focus:'All sounds + real-world practice', tasks:[
      'Review all six sound pairs',
      'Practice all 20 difficult words with recordings',
      'Record a 1-minute self-introduction using marketing vocabulary',
      'Use ELSA Speak to get AI feedback on your pronunciation'
    ]}
  ]
};

/* ---------------------------------------------------------------------
   RECORDING STATE (module-level — persists during the session)
   --------------------------------------------------------------------- */
let speakingRecorder = null;
let speakingChunks = [];
let speakingRecording = false;
let speakingAudioURL = null;

/* ---------------------------------------------------------------------
   RENDER — master draw function
   --------------------------------------------------------------------- */
function drawSpeaking(){
  drawSpeakingTools();
  drawSpeakingWords();
  drawSpeakingSounds();
  drawSpeakingSentences();
  drawSpeakingDailyPlan();
  drawSpeakingSchedule();
  drawSpeakingProgress();
}

/* ---------------------------------------------------------------------
   SECTION: Pronunciation Tools
   --------------------------------------------------------------------- */
function drawSpeakingTools(){
  const el = $('speakingTools');
  if(!el) return;

  let html = '';
  SPEAKING_DATA.tools.forEach(function(tool){
    html += '<a class="speakTool" href="' + esc(tool.url) + '" target="_blank" rel="noopener">'
      + '<span class="speakToolIcon">' + esc(tool.icon) + '</span>'
      + '<span class="speakToolName">' + esc(tool.name) + '</span>'
      + '<span class="speakToolDesc">' + esc(tool.desc) + '</span>'
      + '<span class="speakToolLink">OPEN →</span>'
      + '</a>';
  });
  el.innerHTML = html;
}

/* ---------------------------------------------------------------------
   SECTION: Difficult Words
   --------------------------------------------------------------------- */
function drawSpeakingWords(){
  const el = $('speakingWords');
  if(!el) return;

  const wordsDone = (S.speaking && S.speaking.wordsDone) ? S.speaking.wordsDone.length : 0;

  let html = '';
  SPEAKING_DATA.words.forEach(function(w){
    const isDone = S.speaking && S.speaking.wordsDone && S.speaking.wordsDone.indexOf(w.id) >= 0;
    html += '<div class="wordCard' + (isDone ? ' wordDone' : '') + '">'
      + '<div class="wordHead">'
      + '<span class="wordName">' + esc(w.word) + '</span>'
      + '<span class="wordPhonetic">' + esc(w.phonetic) + '</span>'
      + '<button class="playBtn" onclick="playWord(\'' + esc(w.word) + '\')" title="Hear pronunciation">▶</button>'
      + '<button class="wordCheck' + (isDone ? ' checked' : '') + '" onclick="markWordDone(\'' + w.id + '\')" title="Mark as practiced">✓</button>'
      + '</div>'
      + '<div class="wordMistake">⚠ ' + esc(w.mistake) + '</div>'
      + '<div class="wordExample">" ' + esc(w.example) + ' "</div>'
      + '</div>';
  });
  el.innerHTML = html;

  const tag = $('speakingWordsTag');
  if(tag) tag.textContent = wordsDone + ' / ' + SPEAKING_DATA.words.length + ' DONE';
}

/* ---------------------------------------------------------------------
   SECTION: Difficult Sounds
   --------------------------------------------------------------------- */
function drawSpeakingSounds(){
  const el = $('speakingSounds');
  if(!el) return;

  let html = '';
  SPEAKING_DATA.sounds.forEach(function(s){
    html += '<div class="soundCard">'
      + '<div class="soundPair">' + esc(s.pair) + '</div>'
      + '<div class="soundDesc">' + esc(s.desc) + '</div>'
      var firstKey = Object.keys(s).find(function(k){ return k !== 'id' && k !== 'pair' && k !== 'desc' && k !== 'tip' && Array.isArray(s[k]); });
      var secondKey = Object.keys(s).find(function(k){ return k !== 'id' && k !== 'pair' && k !== 'desc' && k !== 'tip' && Array.isArray(s[k]) && k !== firstKey; });

      html += '<div class="soundPairs">'
        + '<div class="soundCol">'
        + '<div class="soundLabel">' + esc(s.pair.split('vs')[0].trim()) + '</div>';
      if(firstKey) s[firstKey].forEach(function(w){
        html += '<span class="soundWord">' + esc(w) + '</span>';
      });
      html += '</div>'
        + '<div class="soundCol">'
        + '<div class="soundLabel">' + esc(s.pair.split('vs')[1].trim()) + '</div>';
      if(secondKey) s[secondKey].forEach(function(w){
        html += '<span class="soundWord">' + esc(w) + '</span>';
      });
      html += '</div>'
        + '</div>'
      + '<div class="soundTip">💡 ' + esc(s.tip) + '</div>'
      + '</div>';
  });
  el.innerHTML = html;
}

/* ---------------------------------------------------------------------
   SECTION: Practice Sentences
   --------------------------------------------------------------------- */
function drawSpeakingSentences(){
  const el = $('speakingSentences');
  if(!el) return;

  let html = '';
  SPEAKING_DATA.sentences.forEach(function(g){
    html += '<div class="sentenceGroup">'
      + '<div class="sentenceGroupTitle">' + esc(g.group) + '</div>'
      + '<div class="sentenceList">';
    g.sentences.forEach(function(s, i){
      html += '<div class="sentenceItem">'
        + '<span class="sentenceNum">' + (i + 1) + '</span>'
        + '<span class="sentenceText">' + esc(s) + '</span>'
        + '<button class="playBtn small" onclick="playWord(\'' + esc(s) + '\')" title="Hear sentence">▶</button>'
        + '</div>';
    });
    html += '</div></div>';
  });
  el.innerHTML = html;
}

/* ---------------------------------------------------------------------
   SECTION: Daily Training Plan
   --------------------------------------------------------------------- */
function drawSpeakingDailyPlan(){
  const el = $('speakingDailyPlan');
  if(!el) return;

  let html = '<div class="planList">';
  SPEAKING_DATA.dailyPlan.forEach(function(p){
    html += '<div class="planItem">'
      + '<div class="planTime">' + esc(p.time) + '</div>'
      + '<div class="planBody">'
      + '<div class="planTitle">' + esc(p.title) + '</div>'
      + '<div class="planDesc">' + esc(p.desc) + '</div>'
      + '</div>'
      + '</div>';
  });
  html += '</div>';
  el.innerHTML = html;
}

/* ---------------------------------------------------------------------
   SECTION: 4-Week Schedule
   --------------------------------------------------------------------- */
function drawSpeakingSchedule(){
  const el = $('speakingSchedule');
  if(!el) return;

  let html = '';
  SPEAKING_DATA.weeks.forEach(function(w){
    html += '<div class="weekCard">'
      + '<div class="weekHeader">'
      + '<div class="weekNumber">WEEK ' + w.week + '</div>'
      + '<div class="weekTitle">' + esc(w.title) + '</div>'
      + '</div>'
      + '<div class="weekFocus">Focus: ' + esc(w.focus) + '</div>'
      + '<div class="weekTasks">';
    w.tasks.forEach(function(t){
      html += '<div class="weekTask">'
        + '<span class="weekTaskCheck">○</span>'
        + '<span>' + esc(t) + '</span>'
        + '</div>';
    });
    html += '</div></div>';
  });
  el.innerHTML = html;
}

/* ---------------------------------------------------------------------
   SECTION: Progress Tracking
   --------------------------------------------------------------------- */
function drawSpeakingProgress(){
  const el = $('speakingProgress');
  if(!el) return;

  const prog = getSpeakingProgress();
  const recordings = (S.speaking && S.speaking.recordings) ? S.speaking.recordings.length : 0;

  let html = '<div class="grid">'
    + '<div class="stat">'
    + '<div class="h"><span class="n">Words Practiced</span><span class="lv">' + prog.wordsDone + ' / ' + prog.totalWords + '</span></div>'
    + '<div class="bar thin"><i style="width:' + prog.wordPct + '%"></i></div>'
    + '<div class="sb">+5 XP per word</div>'
    + '</div>'
    + '<div class="stat">'
    + '<div class="h"><span class="n">Recordings</span><span class="lv">' + recordings + '</span></div>'
    + '<div class="bar thin"><i style="width:' + Math.min(100, recordings * 10) + '%"></i></div>'
    + '<div class="sb">+10 XP per recording</div>'
    + '</div>'
    + '<div class="stat">'
    + '<div class="h"><span class="n">Overall Progress</span><span class="lv">' + prog.overallPct + '%</span></div>'
    + '<div class="bar thin"><i style="width:' + prog.overallPct + '%"></i></div>'
    + '<div class="sb">Words + recordings combined</div>'
    + '</div>'
    + '</div>'
    + '<div class="recordingArea">'
    + '<button class="recBtn' + (speakingRecording ? ' recActive' : '') + '" onclick="speakingRecording ? stopRecording() : startRecording()">'
    + (speakingRecording ? '⏹ Stop & Play' : '⏺ Record Yourself')
    + '</button>'
    + '<div class="recStatus" id="recStatus">'
    + (speakingRecording ? 'Recording... speak now!' : 'Record yourself saying a word or sentence, then stop to play it back.')
    + '</div>'
    + '</div>';

  el.innerHTML = html;

  const tag = $('speakingProgressTag');
  if(tag) tag.textContent = prog.overallPct + '%';
}

/* ---------------------------------------------------------------------
   FUNCTION: playWord — uses speechSynthesis API
   --------------------------------------------------------------------- */
function playWord(word){
  if(!('speechSynthesis' in window)){
    alert('Speech synthesis is not supported in this browser.');
    return;
  }
  try{
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(word);
    u.lang = 'en-US';
    u.rate = 0.85;
    window.speechSynthesis.speak(u);
    sfx('tab');
  }catch(e){}
}

/* ---------------------------------------------------------------------
   FUNCTION: startRecording — uses MediaRecorder API
   --------------------------------------------------------------------- */
function startRecording(){
  if(speakingRecording) return;

  if(!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia || typeof MediaRecorder === 'undefined'){
    alert('Recording is not supported in this browser. Try Chrome or Edge.');
    return;
  }

  navigator.mediaDevices.getUserMedia({ audio:true })
    .then(function(stream){
      speakingChunks = [];
      speakingRecorder = new MediaRecorder(stream);
      speakingRecorder.ondataavailable = function(e){
        if(e.data && e.data.size > 0) speakingChunks.push(e.data);
      };
      speakingRecorder.start();
      speakingRecording = true;
      drawSpeaking();
    })
    .catch(function(){
      alert('Could not access the microphone. Please allow microphone permission.');
    });
}

/* ---------------------------------------------------------------------
   FUNCTION: stopRecording — stops recording, plays back, awards XP
   --------------------------------------------------------------------- */
function stopRecording(){
  if(!speakingRecording || !speakingRecorder) return;

  const recorder = speakingRecorder;
  speakingRecording = false;

  recorder.onstop = function(){
    const blob = new Blob(speakingChunks, { type: recorder.mimeType || 'audio/webm' });

    if(speakingAudioURL) URL.revokeObjectURL(speakingAudioURL);
    speakingAudioURL = URL.createObjectURL(blob);
    const audio = new Audio(speakingAudioURL);
    audio.play().catch(function(){});

    if(!S.speaking) S.speaking = { wordsDone:[], recordings:[] };
    S.speaking.recordings.push({
      date: dayKey(),
      duration: Math.round(blob.size / 1000),
      when: new Date().toLocaleString()
    });

    addXP(10, 'selfdev', false, 'speaking');
    log('RECORDING', 'Recording completed. <b>+10 XP</b>.');
    sfx('badge');

    recorder.stream.getTracks().forEach(function(track){ track.stop(); });

    drawSpeaking();
  };

  recorder.stop();
  drawSpeaking();
}

/* ---------------------------------------------------------------------
   FUNCTION: markWordDone — toggles a word as practiced, +5 XP
   --------------------------------------------------------------------- */
function markWordDone(wordId){
  if(!S.speaking) S.speaking = { wordsDone:[], recordings:[] };

  const word = SPEAKING_DATA.words.find(function(w){ return w.id === wordId; });
  if(!word) return;

  const idx = S.speaking.wordsDone.indexOf(wordId);
  if(idx >= 0){
    S.speaking.wordsDone.splice(idx, 1);
    subXP(5, 'selfdev', 'speaking');
    sfx('uncheck');
  } else {
    S.speaking.wordsDone.push(wordId);
    addXP(5, 'selfdev', false, 'speaking');
    sfx('vocab');
    log('WORD PRACTICED', 'Practiced <b>' + esc(word.word) + '</b>. <b>+5 XP</b>.');
  }
  save();
  renderAll();
}

/* ---------------------------------------------------------------------
   FUNCTION: getSpeakingProgress — returns overall progress
   --------------------------------------------------------------------- */
function getSpeakingProgress(){
  const totalWords = SPEAKING_DATA.words.length;
  const wordsDone = (S.speaking && S.speaking.wordsDone) ? S.speaking.wordsDone.length : 0;
  const recordings = (S.speaking && S.speaking.recordings) ? S.speaking.recordings.length : 0;

  const maxScore = totalWords + 4;
  const score = wordsDone + recordings * 2;

  return {
    wordsDone: wordsDone,
    totalWords: totalWords,
    recordings: recordings,
    wordPct: totalWords ? Math.round(wordsDone / totalWords * 100) : 0,
    overallPct: maxScore ? Math.round(score / maxScore * 100) : 0
  };
}
