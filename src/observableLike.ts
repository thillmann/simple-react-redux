export interface ObserverLike<T> {
  next: (value: T) => void;
}

export interface SubscriptionLike {
  unsubscribe: () => void;
}

export interface ObservableLike<T> {
  subscribe: (observer: ObserverLike<T>) => SubscriptionLike;
}