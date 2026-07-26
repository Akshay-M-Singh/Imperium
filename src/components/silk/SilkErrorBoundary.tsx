"use client";

import { Component, type ReactNode } from "react";
import Image from "next/image";
import styles from "./ChampagneSilkHero.module.css";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class SilkErrorBoundary extends Component<Props, State> {
  override state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  override render() {
    if (this.state.hasError) {
      return (
        <Image
          src="/images/hero/silk-still.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className={styles.still}
        />
      );
    }
    return this.props.children;
  }
}
