import { SampleMaterial } from '../types';

export const SAMPLE_MATERIALS: SampleMaterial[] = [
  {
    id: 'crispr-genetics',
    title: 'CRISPR-Cas9 & Genetic Engineering',
    category: 'Biotechnology & Genetics',
    subject: 'Molecular Biology',
    level: 'undergraduate',
    content: `Clustered Regularly Interspaced Short Palindromic Repeats (CRISPR) paired with the Cas9 endonuclease enzyme constitute a revolutionary adaptive immune system originally discovered in prokaryotes like bacteria and archaea. In nature, bacteria capture genomic fragments from invading bacteriophages and store them in repeating spacer sequences within their own CRISPR array. Upon reinfection, the bacteria transcribe these spacer sequences into CRISPR RNA (crRNA), which hybridizes with trans-activating crRNA (tracrRNA) to guide Cas9 directly to the matching foreign DNA sequence.

In synthetic biology and laboratory medicine, Jennifer Doudna and Emmanuelle Charpentier engineered this two-part RNA system into a single synthetic chimeric molecule known as single-guide RNA (sgRNA). Cas9 requires two binding conditions to initiate double-strand cleavage: first, strict complementary sequence recognition between the 20-nucleotide guide region of the sgRNA and the target genomic DNA; second, the presence of a 2-to-6 base pair protospacer adjacent motif (PAM) immediately flanking the target 3' end, typically 5'-NGG-3' for Streptococcus pyogenes Cas9 (SpCas9).

Once Cas9 binds the PAM and verifies Watson-Crick pairing, its twin nuclease domains—HNH and RuvC—produce a precise double-strand break (DSB) exactly three base pairs upstream of the PAM. Cells respond to DSBs via two primary endogenous repair pathways: Non-Homologous End Joining (NHEJ), an error-prone mechanism that frequently inserts or deletes random bases (indels) leading to premature stop codons and gene knockout; or Homology-Directed Repair (HDR), an error-free template-dependent pathway that allows researchers to supply an exogenous donor DNA template to insert specific therapeutic alleles or correct mutations. Modern variants including base editors (catalytically dead dCas9 fused to cytidine or adenosine deaminases) and prime editors (dCas9 fused to reverse transcriptase) allow direct nucleotide conversion without causing toxic double-strand breaks.`
  },
  {
    id: 'quantum-computing',
    title: 'Quantum Computing: Superposition & Entanglement',
    category: 'Physics & Computer Science',
    subject: 'Quantum Physics',
    level: 'undergraduate',
    content: `Classical computing relies on physical transistors acting as bits that assume discrete binary states of either 0 or 1. In contrast, quantum computing harnesses fundamental quantum mechanical phenomena to manipulate qubits—two-state quantum mechanical systems capable of existing in continuous linear superpositions of basis states |0⟩ and |1⟩. Mathematically, an arbitrary pure qubit state is represented as |ψ⟩ = α|0⟩ + β|1⟩, where α and β are complex probability amplitudes satisfying the normalization constraint |α|² + |β|² = 1. Geometrically, this single-qubit state space is visualized on the surface of a unit sphere termed the Bloch Sphere.

When two or more qubits interact, they can become quantum mechanically entangled. In an entangled multi-qubit system, the joint quantum state cannot be decomposed into a product of individual component states (tensor product |ψ₁⟩ ⊗ |ψ₂⟩). A canonical example is the Bell State |Φ⁺⟩ = (|00⟩ + |11⟩)/√2. Measuring the first qubit instantaneously dictates the post-measurement state of the second qubit, regardless of spatial separation, a non-local correlation that Albert Einstein famously referred to as "spooky action at a distance."

Quantum algorithms leverage quantum interference to solve specialized mathematical problems with asymptotic advantages over classical algorithms. Shor's algorithm utilizes quantum Fourier transforms to factorize integers in polynomial time O((log N)³), posing an existential threat to classical RSA asymmetric cryptography. Grover's algorithm provides a quadratic speedup O(√N) for unstructured database search. However, current quantum machines reside in the Noisy Intermediate-Scale Quantum (NISQ) era, plagued by environmental decoherence, gate infidelity, and the formidable threshold overhead required for quantum error correction (QEC) with surface codes.`
  },
  {
    id: 'deep-learning-backprop',
    title: 'Deep Learning: Backpropagation & Optimization',
    category: 'Artificial Intelligence',
    subject: 'Machine Learning',
    level: 'undergraduate',
    content: `Artificial neural networks are parameterized function approximators structured as interconnected layers of artificial neurons. Forward propagation computes predictions by transmitting input feature vectors through successive affine transformations followed by non-linear activation functions (e.g., ReLU f(x) = max(0, x), GELU, or Softmax). For layer l, the activation is formulated as a^[l] = σ(W^[l] a^[l-1] + b^[l]), where W represents the weight matrix and b denotes the bias vector. The model's discrepancy between prediction ŷ and ground truth y is quantified using a scalar loss function L(ŷ, y), such as categorical cross-entropy for multi-class classification or Mean Squared Error (MSE) for regression.

Training deep neural networks relies on the backpropagation algorithm, which efficiently computes the gradient of the loss function with respect to every weight parameter in the network via recursive application of the calculus chain rule. By calculating error terms δ^[l] = ∂L/∂z^[l] at the output layer and propagating them backward through the transpose of weight matrices, backpropagation avoids redundant derivative computations, scaling linearly with network depth.

Once gradients ∇_W L are computed, optimization algorithms iteratively adjust parameters along the negative gradient surface. Standard Stochastic Gradient Descent (SGD) with update rule W ← W - η ∇_W L frequently suffers from slow convergence across saddle points and high variance in mini-batch sampling. Modern deep learning architectures universally prefer adaptive moment estimation algorithms like Adam (Adaptive Moment Estimation) and AdamW (which decouples L2 weight decay regularization from gradient updates). Adam maintains exponentially decaying averages of past gradients (first raw moment m_t) and past squared gradients (second uncentered moment v_t), scaling learning rates dynamically per parameter to handle sparse gradients and ill-conditioned loss landscapes.`
  },
  {
    id: 'monetary-policy',
    title: 'Central Banking: Monetary Policy & Inflation Control',
    category: 'Economics & Finance',
    subject: 'Macroeconomics',
    level: 'undergraduate',
    content: `Central banks operate as apex monetary authorities responsible for macroeconomic stability, generally charged with dual mandates: maintaining price stability (typically targeted at approximately 2% headline inflation) and promoting maximum sustainable employment. When an economy experiences demand-pull or cost-push inflation exceeding tolerance bands, central banks deploy contractionary monetary policy. Conversely, during economic downturns, recessions, or deflationary traps, expansionary monetary policy is initiated to stimulate aggregate demand.

The primary operational tool of monetary policy is the policy interest rate (such as the Federal Funds Rate in the United States or the Deposit Facility Rate in the Eurozone). By adjusting this overnight interbank lending rate, central banks influence the yield curve across financial markets. Commercial banks transmit these benchmark adjustments to mortgages, commercial debt, and consumer loans through the monetary transmission mechanism. Rising nominal interest rates raise the cost of capital, suppress business capital expenditure (CapEx), incentivize consumer savings over discretionary consumption, and often cause foreign exchange appreciation, reducing imported inflation.

When nominal interest rates approach the Zero Lower Bound (ZLB), conventional policy instruments lose traction. Central banks then pivot to unconventional monetary tools, most notably Quantitative Easing (QE)—large-scale open market asset purchases of sovereign bonds and mortgage-backed securities to suppress long-term yields and inject liquidity into banking reserves—and Forward Guidance, which transparently shapes market expectations regarding the future trajectory of interest rates. The relationship between inflation and unemployment is historically framed by the Phillips Curve, while the classic Taylor Rule mathematically models the optimal policy rate as a function of the equilibrium real interest rate, current inflation gap, and output gap.`
  }
];
