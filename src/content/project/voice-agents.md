---
title: Intelligence is not instant
publishDate: 2026-08-20 CST
description: Voice cannot chase intelligence the way text agents do. Larger models and more thinking time kill the call, so real work has to happen off the spoken path.
tags: ["llms", "machine-learning", "performance", "research"]
---

Agents are taking over everything, and talking to them still sucks. I recently had a call with a voice agent (not one of mine) and I wanted to pull my hair out. I figure it's finally time I talk about how we can do better.

Voice is really hard to get right. The constraints are so different, and you have far less to work with. In voice, latency is everything: the instant the natural flow of conversation gets killed, you feel an unbearable friction. It sucks to wait, and it sucks to feel like you are talking to a robot. However, we also want agents to do actual work, and work takes time.

## The two scaling axes do not fit on a call

Let's walk through the fundamental challenges, because they dictate our options for improving our experiences. Recent model development has been predicated on two scaling axes:

1. Larger models
2. More inference-time compute

Both of these are fundamentally incompatible with voice. Larger models are slower models. Reasoning tokens, the extra tokens a model generates to think before it answers, are synchronous: they block responding to the user. So while the industry is focused on chasing intelligence through scaling, we have to get smart to get intelligence that appears instant.

You might think the obvious approach is to just train smaller models to be more effective agents. This does work, and I highly recommend training specialist models. You can really push smaller models: more intelligence than their size suggests, a style you actually own, and better economics. But this alone is not a silver bullet.

Let's look at an example.

## A reservation change is five inferences and three tools

A caller says: "Can you move my 7pm to 8?" A person at the host stand does this while still talking. An agent that is not just a chatbot has to do work, and the work is serial. A tool result does not get spoken at the end of the turn that called it. It lands in context, and the next turn's TTFT is the prefill of that result.

```text
caller:  "Can you move my 7pm to 8?"

turn 1   TTFT (prefill of the utterance)
         → decode tool call: lookup reservation
         → tool: lookup reservation

turn 2   TTFT (prefill of the lookup result)
         → decode tool call: check 8pm availability
         → tool: check 8pm availability

turn 3   TTFT (prefill of the availability result)
         → decode "8 is open, should I move it?"

caller:  "Yes"

turn 4   TTFT (prefill of "Yes")
         → decode tool call: update the booking
         → tool: update the booking

turn 5   TTFT (prefill of the update result)
         → decode "You're set for 8."
```

Even with a small, fast specialist, you pay for every generation, it's just the nature of serial work. In LLM inference we usually talk about two metrics: **TTFT** (time-to-first-token), how long it takes before the first token of this generation arrives, and **TPS** (tokens per second), how fast tokens get generated after that. TTFT includes prefill, the cost of reading the context you already have. After a tool returns, that prefill is how the next turn starts: the model has to read the result before it can decode the next tool call or the first spoken token. Decode time is the length of what you generate divided by TPS, whether that generation is a tool call or a sentence the caller hears. Then there is the tool itself: the database lookup, the API call, the calendar check — things engineers are used to optimizing.

[!NOTE]
I wouldn't normally bring up the differences between decode and prefill but I want to call out prefill to make an important point. These are both important axes to tune and in current inference engines there are real tradeoffs relevant to the use case. Prefill is dependent on the input content length (in our case the only thing of real consequence is tool results being massive walls of text) and the content that needs to be generated for decode. Most people today speak of TPS (decode) in reference to coding agents/knowledge work where there is longer generations and structured patterns that enable optimizations in the engines and model such as speculative decoding to make huge improvements. Without a lot of work and tuning, these optimizations don't always come free for cases like voice agents.

Those penalties stack on every generation, and they multiply by how many generations the task needs. Three tools plus two spoken replies is five TTFTs, five decodes, and three tool executions. The caller hears nothing until the end of turn 3, then nothing again through the update. A human overlapping "let me see... yep, I can do 8" is one breath. The agent is a pipeline.

The deck is stacked against you the second you have to do real work and are not just a chatbot. You can make tools smarter and higher-utility so the model needs fewer turns, and you absolutely should, but it is an uphill battle. Every new capability you add (modify the party size, honor a seating request, apply a note) is another tool hop you might need in series. A great solution is multi-agent systems: keep a fast model on the spoken path so the call does not die, and let other agents do the work that takes time.

Walden at Cognition wrote a few posts in the last year that I found interesting. [Don't Build Multi-Agents](https://cognition.com/blog/dont-build-multi-agents) and [what's actually working](https://cognition.com/blog/multi-agents-working) cover the challenges and wins in multi-agent systems from a coding and knowledge-work perspective. During my time at Maple leading the development of our agents, we have had similar philosophies, but voice diverges in a lot of ways, so I thought it would be interesting to call out some of the similarities and differences.

The first major similarity is our consensus on splitting up responsibilities rather than swarming agents. One agent should own the thing the user actually experiences, and other agents should contribute work around it, because two writers conflict. The difference is the clock. Their user will wait on a diff. Ours will not. That makes it a different challenge so that's why the patterns I'll get into are all about getting work off the spoken path, and being aware of the fact that time is passing while we work.

[!NOTE]
Sidebar - I get such a kick out of working with agents that have no real concept of time. When Claude tells me "You've identified the real load-bearing tranche, and honestly this will take 6-10 weeks to implement." I chuckle to myself as I send my agent back to knock it all out over the next hour. I feel like we should start timestamping all messages in our transcripts to give models a bit of a reality check and reference for their own speed.

## Blocking delegation makes the conversation wait

The first pattern is the obvious one: treat the sub-agent like a blocking tool. The primary, the one actually on the call, hands work off and waits. While it waits you have to keep the line alive, so you generate a backchannel, a short bit of speech that covers the gap ("just a second, I'm pulling that up"), and you hope the sub-agent comes back before you run out of things to say or the pause gets uncomfortable.

```text
         speech           filler              answer
user   |========|
voice            |====|................|================|
sub                    |======work======|
                       ^ blocked until done
```

This can work for short lookups. It falls apart the moment the work is longer than a natural pause. Now you have to invent more speech that does not commit you to a wrong answer, and you have to handle barge-in, the user talking over the agent, on that speech. If they interrupt the filler, do you cancel the sub-agent? If they ask a new question, do you keep the old result? Making the handoff sound like a conversation rather than a tool call is a prompting and timing problem that is actually quite difficult.

[!NOTE]
Making this filler natural for conversation is actually quite difficult. If you don't precompute information and give it to the agent, you are effectively prohibited from committing to anything without the sub-agent responding. You don't know what the schedule looks like without checking — so you need to be cautious overplaying your hand. You cannot handle situations with confidence — "Yeah I'm pretty sure we have a table open but let me make sure..." this can work in some cases but what about policies or procedures? What about when it's annoying or even harmful to temporarily give the wrong information? As an exercise try to role play as a receptionist with someone. Whenever they ask you for something try to respond naturally but you can never respond instantly with an actually helpful response. Instead pause for a few moments before getting back to them. See how quickly you run out of filler and the conversation becomes awkward. If you have interesting thoughts on these conversational dynamics, I'd love to chat about how we've worked on this problem at Maple!

The blocking version is the most reliable of the three for correctness, because the primary sees the full result before it says anything. It is also the most prone to conversational breakdown and miserable waiting.

## A backchannel is a forecast that the work will be late

This is the part that is inherently hard, even before you get to fancy solutions. A human who already has the fact just answers. There is no gap. The same question to an agent is often a retrieval or a tool call, so the gap is there unless you already put the fact on the spoken path.

One way off that gap is to precompute: memory, account state, likely facts, whatever the next turn will need, so the primary can speak without waiting. That only works if you predicted the right things, and the caller can always ask something you did not fetch. That foresight is its own system, and it is a lot of work.

The other way is to decide, at the turn, whether this particular piece of work will come back inside a natural pause. If you think it will not, you hold the floor with a backchannel. If you think it will, you wait and speak the answer. Both mistakes are audible. Fill when the result is already there and you get "let me check on that" into a fact you could have just said. Skip the fill when the tool is slow and you get dead air.

```text
human, fact in memory        |==answer==|
agent, prefetch hit          |==answer==|
agent, fill, result late     |==check==|........|==answer==|
agent, fill, result ready    |==check==|==answer==|   <- filled for a ready result
agent, no fill, result late  |..........|==answer==|  <- dead air
```

Most products skip the forecast and play a stock "um", "mm-hmm", or "let me check on that" on every lookup. I have talked to a lot of these systems as a caller, and they are painful. The filler is the same clip whether the answer is two hundred milliseconds away or four seconds away. Generic hacks for fake instant intelligence do not work. If you want the call to feel like a conversation, the backchannel has to be a real prediction about latency, not a hold message.

## Turn-boundary async still waits for a turn

The second pattern is the same split, but the sub-agent runs in the background. The primary launches it, keeps talking, and the result gets messaged back into the primary's context. In a text agent this is fine, because the next message can wait. In a voice agent the obvious place to splice that message in is the next turn boundary: wait until the current utterance is done being spoken, then inject.

```text
         speech    utterance, still uninformed     next turn, now informed
user   |====|
voice        |=========================|      |================|
sub          |====work====|
                           ^ result waits here for end of speech
```

You get overlapping compute, which is the whole point. You also get the overhead of passing messages back and forth, and a worse version of the filler problem: the primary is still talking, and everything it says until the turn ends was generated without the result. If it already committed to "I don't see a reservation under that name" while the sub-agent was about to find one, the next turn has to walk that back out loud.

The turn boundary is convenient because existing voice stacks are half-duplex and existing agent harnesses are turn-shaped. However just because it's convenient doesn't make it right. The user is listening the whole time, so the useful moment is whenever the result arrives, not whenever the current sentence happens to end.

## Truncate what has not been spoken

The third pattern is an async sub-agent that does not wait on the turn. This only works because spoken audio plays at a constant speed, and we can generate tokens way faster than we can speak them. That gap is padding. The primary is generating a response of _t_ tokens. Some of those have already been synthesized and played; call the remainder _x_, so _t − x_ tokens are in the world. Of those _x_, some are already in the buffer or the TTS pipeline and are committed, and the rest have been generated but not yet spoken. When the sub-agent returns, you truncate the unplayed tail and continue generation with the result in context, so the rest of the utterance can change.

```text
generated  t0 t1 t2 t3 t4 t5 t6 t7 t8 t9 t10 t11
spoken     t0 t1 t2 t3 t4
in-flight              t5 t6          <- padding, already committed
unplayed                     t7 t8 t9 t10 t11   <- drop
                  ^
                  sub-agent result arrives
resume                       t7' t8' t9' ...    <- steered from here
```

If you can pull this off, you get async work and a single spoken stream that does not stall. The primary can start a sentence before it knows the answer and finish the sentence knowing the answer, which is how people actually talk when they are looking something up. That only works if the prefix was a real continuation rather than a stock hold, because a splice cannot unsay "let me check on that."

This is the one that is actually hard. You need an inference stack that can stop a generation, keep the KV cache for the spoken prefix, and resume with new tokens in the middle of an utterance. You need padding that matches the audio pipeline, or you get a glitch at the splice. You need the primary to have been generating something that can be steered rather than retracted: if it already said the wrong fact, truncation cannot unsay it. And you need a model that does not fall apart when its own continuation is replaced, which basically all models will, because they were trained on complete turns.

## The models were trained for turns

You can approximate the splice in a harness: cancel the in-flight generation, keep the cache for the spoken prefix, prompt the model with that prefix plus the sub-agent result, keep talking. It is brittle. The model was trained to produce a complete assistant turn, so mid-utterance context injection looks like a different task. You see hedges, restarts, and answers that ignore the new information because the model is still completing the sentence it started.

The good news is that generating SFT traces for this is actually quite simple. **SFT** (supervised fine-tuning) is imitation: you show the model (context, desired continuation) pairs and train it to produce the continuation. For a splice, the pair is: spoken prefix plus a tool or sub-agent result that arrived mid-utterance, and a continuation that uses the result without unsaying the prefix. You can build those traces from ordinary complete turns. Take a finished utterance, pick a splice point _k_ that would have been reached in wall-clock time given that we generate faster than we speak, insert the result as if it landed then, and write (or have a teacher model write) the rest of the sentence as if the speaker just learned the answer. Do that across a lot of tasks and splice points and you have a dataset of interrupted continuations.

RL on top of that is the obvious next step. You already know what "good" looks like: the prefix stays intact, the new information shows up in the remainder, the model does not restart or hedge, and it does not stall. Those are checkable rewards. You do not need a new training paradigm. You need traces that look like the thing you want at inference time, which most voice fine-tunes still do not have, because they look like complete turns.

This is how you get a primary that can be steered. The harness still has to do the truncation and resumption. The model has to treat the splice as a normal continuation instead of a distribution shift. Neither is free, but neither is mysterious.

## Full duplex helps the conversation, not the work

Full duplex is the other thing people point at when they want the call to feel human. A full-duplex model listens and speaks at the same time, so you can talk over each other, turn-taking gets more natural, and a lot of the interruption and conversational brittleness of orchestrating half-duplex agents goes away. If it is done well, the model can use the audio itself: tone, pacing, a correction mid-sentence. Transcription errors become less of a critical failure mode, because you are not forcing every bit of meaning through a transcript.

That is the pitch, and it is not always true. There's plenty of research about the [intelligence drop](https://qwen.ai/blog?id=qwen3-omni-flash-20251201) on casual spoken input relative to text, which is the thing native audio is supposed to fix. [VoiceBench](https://arxiv.org/abs/2410.17196) found that a naive ASR-plus-LLM pipeline still beat open end-to-end voice models on spoken instructions by a wide margin: the speech-to-speech model hears the audio and still understands less than a cascade that transcribes first. You can see the same shape on [τ-voice](https://arxiv.org/abs/2603.13686), which puts full-duplex agents on real customer-service tasks. Even under clean audio, voice agents retain only a fraction of the text model's task completion; under noise, accents, and interruptions it drops further. Today's speech-to-speech models are still worse than pipeline models on a lot of audio understanding and agentic work, which is a pretty strong signal that something is off in how they are being trained.

In an ideal world, yes: a native full-duplex model would absorb a lot of the turn-taking, barge-in, and backchannel problems this post has been about. None of them natively solve the actual problem, which is taking actions in real time while speech is already leaving the speaker. S2S models from frontier labs like GPT-Live and Grok Voice Think Fast get closer (and I have to say remarkably so) by doing a two-tiered, multi-model approach: a fast model stays on the audio path so the call does not die, and another model or system does the work in the background. That is the same split as the third pattern, trained into the product instead of bolted on in a harness. It is also the existence proof that you do not get instant intelligence by wishing the spoken model were bigger.

Work takes time, and a caller cannot wait. That is the whole constraint. You can hide the wait in a filler, in the next turn, or in the unplayed tail of the sentence you are already saying. Only the last one lets the conversation keep moving while the work is still running, and it only works if you train the model for interrupted continuations instead of complete turns. Full duplex will make the talking feel better. It will not make the lookup free. There is no perfect shortcut for instant intelligence.

I'll write more soon about full-duplex voice, and a model I've been working on for the last few months. The constraint will not have changed.
