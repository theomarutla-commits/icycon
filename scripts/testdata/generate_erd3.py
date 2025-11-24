import os
import sys
import subprocess

def install_graphviz():
    try:
        # Try to install graphviz using pip
        subprocess.check_call([sys.executable, "-m", "pip", "install", "graphviz"])
        return True
    except subprocess.CalledProcessError:
        print("Failed to install graphviz Python package")
        return False

def is_graphviz_installed():
    try:
        import graphviz
        return True
    except ImportError:
        return False

def main():
    if not is_graphviz_installed():
        print("Installing required Python package...")
        if not install_graphviz():
            print("Error: Could not install required package")
            return

    import graphviz

    # Read the DOT file
    dot_file_path = 'icycon/erd2.dot'
    if not os.path.exists(dot_file_path):
        print(f"Error: Could not find file {dot_file_path}")
        return

    with open(dot_file_path, 'r') as f:
        dot_content = f.read()

    # Create a Graphviz object from the DOT content
    graph = graphviz.Source(dot_content)

    # Set rendering options for better quality
    graph.format = 'png'
    graph.engine = 'dot'

    try:
        # Render the graph
        output_path = os.path.join('icycon', 'erd')
        graph.render(output_path, view=True, cleanup=True)
        print(f"ERD has been generated as {output_path}.png")
    except Exception as e:
        print(f"Error generating ERD: {str(e)}")

if __name__ == "__main__":
    main()