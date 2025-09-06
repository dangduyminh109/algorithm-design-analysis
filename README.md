# Algorithm Complexity Visualizer

🎯 **Interactive visualization platform for understanding algorithm complexity**

An educational web application built with Next.js, React, TypeScript, and TailwindCSS that provides interactive visualizations for various algorithms including sorting, searching, and extreme value finding algorithms.

## ✨ Features

### 🏠 Interactive Homepage
- **3D Animated Bubbles**: Three floating bubbles representing different algorithm categories
- **Smooth Animations**: Built with Framer Motion for beautiful transitions
- **Responsive Design**: Works seamlessly across all device sizes

### 🔄 Sorting Algorithms
- **Bubble Sort**: Simple comparison-based algorithm with O(n²) complexity
- **Selection Sort**: Finds minimum element and places it at the beginning
- **Insertion Sort**: Builds sorted array one element at a time
- **Quick Sort**: Divide-and-conquer algorithm with O(n log n) average complexity
- **Merge Sort**: Stable sorting algorithm with guaranteed O(n log n) performance

### 🔍 Searching Algorithms
- **Linear Search**: Sequential search through unsorted arrays
- **Binary Search**: Efficient search for sorted arrays with O(log n) complexity

### 📊 Extreme Value Finding
- **Linear Min/Max**: Simple scan to find minimum and maximum values
- **Tournament Method**: Divide-and-conquer approach for finding extremes

## 🎮 Interactive Controls

### Visualization Features
- ▶️ **Play/Pause/Reset**: Full control over algorithm execution
- 🎚️ **Speed Control**: Adjust animation speed from 0.25x to 3x
- 📊 **Step-by-step Navigation**: Manually step through algorithm execution
- 🔢 **Custom Arrays**: Generate new random arrays or adjust array size
- 🎯 **Target Selection**: For searching algorithms, choose what to search for

### Educational Elements
- 📝 **Syntax-highlighted Code**: See the actual implementation
- 📈 **Complexity Analysis**: Understand time and space complexity
- 🎨 **Color-coded Visualization**: Different colors for different states
- 📱 **Real-world Applications**: Learn when to use each algorithm

## 🛠️ Technology Stack

- **Frontend Framework**: Next.js 14 with App Router
- **Language**: TypeScript for type safety
- **Styling**: TailwindCSS for responsive design
- **Animations**: Framer Motion for smooth animations
- **Code Highlighting**: Prism.js for syntax highlighting
- **Icons**: Lucide React for consistent iconography

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd algorithm-complexity-visualizer
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
src/
├── app/                          # Next.js App Router pages
│   ├── algorithms/
│   │   └── [category]/
│   │       ├── page.tsx         # Category listing page
│   │       └── [algorithm]/
│   │           └── page.tsx     # Algorithm detail page
│   ├── globals.css              # Global styles
│   ├── layout.tsx               # Root layout
│   └── page.tsx                 # Homepage
├── components/                   # Reusable React components
│   ├── AlgorithmInfo.tsx        # Algorithm information display
│   ├── CodeBlock.tsx            # Syntax-highlighted code viewer
│   ├── ExtremeValueVisualizer.tsx # Min/Max algorithm visualizer
│   ├── Header.tsx               # Navigation header
│   ├── SearchingVisualizer.tsx  # Search algorithm visualizer
│   └── SortingVisualizer.tsx    # Sorting algorithm visualizer
├── lib/                         # Utility functions and data
│   ├── algorithms.ts            # Algorithm definitions and metadata
│   └── algorithmUtils.ts        # Algorithm implementations with steps
└── types/                       # TypeScript type definitions
    └── algorithm.ts             # Algorithm-related types
```

## 🎨 Design System

### Color Palette
- **Primary**: Blue tones for main interface elements
- **Success**: Green for completed/correct states
- **Warning**: Yellow for comparison/current states
- **Danger**: Red for swapping/error states
- **Purple**: For special elements (pivot, middle, etc.)

### Animation Principles
- **Smooth Transitions**: All state changes are animated
- **Performance**: Optimized animations that don't block the UI
- **User Control**: Users can control animation speed and pause/resume

## 🎓 Educational Goals

This platform helps students and developers:

1. **Visualize Abstract Concepts**: See how algorithms work step-by-step
2. **Understand Complexity**: Learn Big-O notation through practical examples
3. **Compare Algorithms**: See how different approaches solve the same problem
4. **Practice Problem-solving**: Understand when to use which algorithm

## 🌟 Key Learning Outcomes

- **Algorithm Analysis**: Understanding time and space complexity
- **Problem-solving Patterns**: Recognizing divide-and-conquer, greedy approaches
- **Performance Trade-offs**: When to prioritize time vs space vs stability
- **Real-world Applications**: Where these algorithms are used in practice

## 🔧 Customization

### Adding New Algorithms

1. **Define the algorithm** in `src/lib/algorithms.ts`
2. **Implement the step-by-step logic** in `src/lib/algorithmUtils.ts`
3. **Add visualization logic** to the appropriate visualizer component
4. **Update routing** if needed

### Modifying Visualizations

The visualizer components are modular and can be easily customized:
- Change colors in the `getElementColor` functions
- Adjust animation timing in the `delay` calls
- Modify layout in the JSX structure

## 📱 Responsive Design

- **Mobile-first approach**: Optimized for small screens first
- **Flexible layouts**: Grid and flexbox for responsive components
- **Touch-friendly**: All interactive elements work on touch devices
- **Readable typography**: Proper font sizes and contrast ratios

## 🚀 Performance Optimizations

- **Code splitting**: Automatic route-based code splitting
- **Lazy loading**: Components load when needed
- **Optimized animations**: RAF-based animations for smooth performance
- **Memory management**: Proper cleanup of animation timers

## 🤝 Contributing

Contributions are welcome! Areas for improvement:

- Additional algorithms (heap sort, radix sort, etc.)
- More visualization styles (tree-based, graph-based)
- Algorithm comparison mode
- Performance benchmarking
- Additional educational content

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Algorithm implementations inspired by computer science textbooks
- Visual design influenced by modern educational platforms
- Built with modern web technologies for optimal user experience

---

**Happy Learning! 🎉**

Made with ❤️ for computer science education
