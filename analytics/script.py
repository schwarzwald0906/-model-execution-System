import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
import json

# df = pd.read_csv('selectedData.csv')

df = pd.read_csv('../backend/file/output/selectedData.csv')

selected_columns = ['paid_flg', 'customer_rank', 'arrears_at', 'identified_doc', 'career', 'pref', 'sex', 'region', 'entry_age', 'age', 'payway', 'amount']
df_selected = df[selected_columns]

df_encoded = pd.get_dummies(df_selected, columns=['customer_rank', 'identified_doc', 'career', 'pref', 'sex', 'region', 'payway'])

# 目的変数と説明変数の分割
X = df_encoded.drop('paid_flg', axis=1)
y = df_encoded['paid_flg']

# トレーニングセットとテストセットにデータを分割
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# ロジスティック回帰モデルの構築と学習
model = LogisticRegression()
model.fit(X_train, y_train)

# テストデータで予測
y_pred = model.predict(X_test)

# 結果をJSON形式で出力
result = {
    'accuracy': model.score(X_test, y_test),
    'predictions': y_pred.tolist()
}

json_result = json.dumps(result)
print(json_result)



