# articles/utils/render_html.py

def render_tiptap_html(content_json):
    """
    Convert Tiptap JSON into HTML including custom video nodes.
    """

    if not content_json:
        return ""

    def render_node(node):
        node_type = node.get("type")

        # TEXT
        if node_type == "text":
            return node.get("text", "")

        # PARAGRAPH
        if node_type == "paragraph":
            inner = "".join(render_node(child) for child in node.get("content", []))
            return f"<p>{inner}</p>"

        # BOLD & ITALIC
        if node_type == "bold":
            inner = "".join(render_node(child) for child in node.get("content", []))
            return f"<strong>{inner}</strong>"

        if node_type == "italic":
            inner = "".join(render_node(child) for child in node.get("content", []))
            return f"<em>{inner}</em>"

        # IMAGE
        if node_type == "image":
            src = node["attrs"]["src"]
            return f'<img src="{src}" style="max-width:100%; margin:12px 0;" />'

        # YOUTUBE
        if node_type == "youtube":
            src = node["attrs"]["src"]
            return f'''
            <iframe width="100%" height="400"
            src="{src}"
            frameborder="0" allowfullscreen></iframe>
            '''

        # CUSTOM VIDEO (🔥 THE IMPORTANT PART)
        if node_type == "customVideo":
            src = node["attrs"]["src"]
            return f'''
            <video src="{src}" controls preload="metadata"
            style="max-width:100%; border-radius:10px; margin:12px 0;">
            Your browser does not support the video tag.
            </video>
            '''

        # LISTS
        if node_type == "bulletList":
            items = "".join(render_node(child) for child in node.get("content", []))
            return f"<ul>{items}</ul>"

        if node_type == "listItem":
            inner = "".join(render_node(child) for child in node.get("content", []))
            return f"<li>{inner}</li>"

        return ""

    # Render entire document
    html = "".join(render_node(block) for block in content_json.get("content", []))
    return html
