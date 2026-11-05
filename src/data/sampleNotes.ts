export interface SampleNotePreset {
  id: string;
  discipline: string;
  title: string;
  notes: string;
}

export const SAMPLE_NOTES: SampleNotePreset[] = [
  {
    id: 'cs-deadlocks',
    discipline: 'Computer Science',
    title: 'Operating Systems: Deadlocks & Concurrency',
    notes: `OPERATING SYSTEMS & CONCURRENCY: DEADLOCK PRINCIPLES

1. Deadlock Definition:
A deadlock is a situation where a set of processes are blocked because each process is holding a resource and waiting for another resource acquired by some other process in the set.

2. Coffman Conditions (All 4 must hold simultaneously for deadlock to occur):
- Mutual Exclusion: At least one resource must be held in a non-shareable mode (only one process can use it at a time).
- Hold and Wait: A process must be holding at least one resource and requesting additional resources currently held by other processes.
- No Preemption: Resources cannot be preempted; a resource can be released only voluntarily by the process holding it after finishing its task.
- Circular Wait: A closed chain of processes exists such that P0 waits for a resource held by P1, P1 waits for P2, ..., and Pn waits for P0.

3. Handling Strategies:
A. Deadlock Prevention: Invalidate at least one of the 4 Coffman conditions.
- Prevent Circular Wait: Impose a total linear ordering on all resource types (e.g. F(R_i)). Require processes to request resources strictly in increasing order of enumeration.
- Prevent Hold and Wait: Require process to request and allocate all its resources at once before execution begins, or release current resources before requesting new ones. High resource waste and starvation risk.

B. Deadlock Avoidance: Banker's Algorithm (Edsger Dijkstra).
- The system checks before granting any request whether the transition leads to a "Safe State".
- Safe State: There exists a safe execution sequence <P1, P2, ..., Pn> such that for each Pi, the resources that Pi can still request can be satisfied by currently available resources plus resources held by all previous processes Pj (j < i).
- Matrices: Allocation[n,m], Max[n,m], Available[m], Need[n,m] = Max - Allocation.
- Complexity: Banker's algorithm runs in O(m * n^2) where n is number of processes and m is number of resource types.

C. Deadlock Detection & Recovery:
- Resource Allocation Graph (RAG): If no multiple instances, cycle in RAG == deadlock. With multiple instances, cycle is necessary but not sufficient. Use detection algorithm (similar to safety algorithm).
- Recovery: Terminate processes (abort all deadlocked or abort one by one until cycle breaks based on priority/cost) or preempt resources with rollback to a safe checkpoint. Starvation prevention requires aging factor.`,
  },
  {
    id: 'ee-signals',
    discipline: 'Electrical Engineering',
    title: 'Signals & Systems: Fourier Transform & LTI Systems',
    notes: `SIGNALS & SYSTEMS: FOURIER ANALYSIS AND LINEAR TIME-INVARIANT (LTI) SYSTEMS

1. Continuous-Time LTI System Fundamentals:
An LTI system is characterized entirely by its impulse response h(t).
The system output y(t) to an arbitrary input x(t) is given by the convolution integral:
y(t) = x(t) * h(t) = ∫_{-∞}^{∞} x(τ) h(t - τ) dτ

Properties of Convolution:
- Commutative: x(t) * h(t) = h(t) * x(t)
- Associative: [x(t) * h1(t)] * h2(t) = x(t) * [h1(t) * h2(t)]
- Distributive: x(t) * [h1(t) + h2(t)] = x(t) * h1(t) + x(t) * h2(t)

2. Stability and Causality:
- BIBO (Bounded-Input Bounded-Output) Stability: A continuous-time LTI system is BIBO stable if and only if its impulse response is absolutely integrable:
∫_{-∞}^{∞} |h(t)| dt < ∞
- Causality: An LTI system is causal if and only if h(t) = 0 for all t < 0.

3. Continuous-Time Fourier Transform (CTFT):
Forward CTFT:
X(jω) = ∫_{-∞}^{∞} x(t) e^{-jωt} dt

Inverse CTFT:
x(t) = (1 / 2π) ∫_{-∞}^{∞} X(jω) e^{jωt} dω

Key Properties of CTFT:
- Linearity: a x1(t) + b x2(t) ↔ a X1(jω) + b X2(jω)
- Time Shifting: x(t - t0) ↔ e^{-jω t0} X(jω) (Linear phase shift, magnitude unaltered)
- Frequency Shifting (Modulation): e^{jω0 t} x(t) ↔ X(j(ω - ω0))
- Time Differentiation: d/dt [x(t)] ↔ jω X(jω)
- Convolution Property: x(t) * h(t) ↔ Y(jω) = X(jω) H(jω) (Time domain convolution becomes frequency domain multiplication)
- Parseval's Theorem: ∫_{-∞}^{∞} |x(t)|^2 dt = (1 / 2π) ∫_{-∞}^{∞} |X(jω)|^2 dω (Total signal energy is preserved across domains)

4. Nyquist-Shannon Sampling Theorem:
To reconstruct a continuous-time bandlimited signal with maximum frequency component ω_max (or f_max in Hz) without aliasing, the sampling frequency must satisfy:
f_s >= 2 * f_max (Nyquist rate)
The ideal reconstruction filter is a lowpass filter with cutoff frequency ω_c = ω_s / 2 and impulse response proportional to sinc(π t / T_s).`,
  },
  {
    id: 'mech-thermo',
    discipline: 'Mechanical Engineering',
    title: 'Thermodynamics: Heat Engines, 2nd Law & Entropy',
    notes: `THERMODYNAMICS: LAWS OF THERMODYNAMICS & POWER CYCLES

1. The First Law of Thermodynamics:
Energy can be neither created nor destroyed; it can only change forms.
For a closed system undergoing a change of state:
ΔU = Q - W
where:
- ΔU is change in internal energy (U2 - U1)
- Q is heat added to the system (+ when absorbed, - when rejected)
- W is work done by the system (+ when done by system on surroundings, - when work done on system)
For a cyclic process: ∮ dQ = ∮ dW (Net heat transfer equals net work done)

2. The Second Law of Thermodynamics:
A. Kelvin-Planck Statement: It is impossible for any device that operates on a cycle to receive heat from a single thermal reservoir and produce a net amount of work. (Thermal efficiency η_th can never be 100%).
B. Clausius Statement: It is impossible to construct a device that operates in a cycle and produces no effect other than the transfer of heat from a lower-temperature body to a higher-temperature body without external work input.

3. Thermal Efficiency of Heat Engines:
η_th = W_net / Q_in = (Q_H - Q_L) / Q_H = 1 - (Q_L / Q_H)

4. The Carnot Cycle (Maximum Theoretical Efficiency):
Operating between a high temperature reservoir at T_H (Kelvin) and low temperature reservoir at T_L (Kelvin):
η_Carnot = 1 - (T_L / T_H)
Four reversible processes:
1-2: Reversible isothermal expansion (heat addition at T_H)
2-3: Reversible adiabatic (isentropic) expansion (T drops from T_H to T_L)
3-4: Reversible isothermal compression (heat rejection at T_L)
4-1: Reversible adiabatic (isentropic) compression (T rises from T_L to T_H)

5. Entropy (S):
Clausius Inequality: ∮ (dQ / T) <= 0 (equality for internally reversible cycles, strict inequality for irreversible cycles).
Definition of Entropy Change for reversible path:
dS = (dQ / T)_{rev}
Principle of Increase of Entropy: For an isolated system, ΔS_isolated >= 0. Real processes always generate positive entropy (S_gen > 0).

6. Ideal Gas Relations for Entropy Change:
s2 - s1 = C_v * ln(T2 / T1) + R * ln(v2 / v1)
s2 - s1 = C_p * ln(T2 / T1) - R * ln(P2 / P1)`,
  },
];
