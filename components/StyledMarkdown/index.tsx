import "github-markdown-css/github-markdown-dark.css";
import customTwMerge from "helper/customTwMerge";
import "highlight.js/styles/github-dark.css";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import gfm from "remark-gfm";
function StyledMarkdown(props: Parameters<typeof ReactMarkdown>[0]) {
    return (
        <ReactMarkdown
            {...props}
            remarkPlugins={[gfm]}
            rehypePlugins={[rehypeHighlight]}
            className={`markdown-body ${customTwMerge(
                "!bg-transparent",
                props.className
            )}`}
        />
    );
}

export default StyledMarkdown;
