import { defineComponent, VNode } from "vue";

export default defineComponent(
  (props, { slots }) => {
    const renderWithParen = (text: string): VNode[] => {
      const parts = text.split(/(（[^）]*）|〈[^〉]*〉)/g);
      return parts.map(part => {
        if ((part.startsWith("（") && part.endsWith("）")) || (part.startsWith("〈") && part.endsWith("〉")))
          return <span class="text-ctp-overlay1">{part}</span>;
        return <span class="font-bold">{part}</span>;
      });
    };

    return () => (
      <ul>
        {props.list.map((t, i) => (
          <li class={["rounded p-1", i % 2 === 0 ? "bg-ctp-mantle" : ""]}>
            {props.list.length > 0 && renderWithParen(t)}
            {slots.default ? slots.default() : null}
          </li>
        ))}
      </ul>
    );
  },
  {
    props: {
      list: {
        type: Object as () => string[],
      },
    },
  },
);
